#!/usr/bin/env node
/**
 * Structural validation for src/mimeData.json.
 *
 * gatsby-node.js creates a page for every string listed under a type's
 * `deprecates`, `parentOf` and `alternativeTo` links. When one of those
 * collides with another entry's page, Gatsby's createPage silently overwrites
 * and the last write wins -- which has previously caused curated pages to be
 * replaced by empty stubs. The collision ratchet below exists to catch that in
 * review rather than in production.
 */

const fs = require("fs")
const path = require("path")

const DATA_PATH = path.join(__dirname, "..", "src", "mimeData.json")

/**
 * Known-good number of colliding page paths on master.
 *
 * These are the mutually-deprecating pairs tracked in issue #67. The check
 * fails if a change introduces *more* collisions, so the number may be lowered
 * as they are fixed but never raised without a deliberate edit here.
 */
const COLLISION_BASELINE = 15

/**
 * Entries whose `name` is not a valid `type/subtype`.
 *
 * "gcode" predates this check and is live at /gcode, so renaming it would break
 * an indexed URL. It is allowed through deliberately; new malformed names are
 * still rejected. Remove from this list once the entry is given a real media
 * type and a redirect.
 */
const KNOWN_MALFORMED_NAMES = new Set(["gcode"])

const LINK_KEYS = ["deprecates", "relatedTo", "parentOf", "alternativeTo"]
const KNOWN_KEYS = new Set([
    "name",
    "description",
    "fileTypes",
    "links",
    "notices",
    "furtherReading",
])

const errors = []
const warnings = []

const err = (name, msg) => errors.push(`${name}: ${msg}`)
const warn = msg => warnings.push(msg)

let raw
try {
    raw = fs.readFileSync(DATA_PATH, "utf8")
} catch (e) {
    console.error(`Could not read ${DATA_PATH}: ${e.message}`)
    process.exit(1)
}

let data
try {
    data = JSON.parse(raw)
} catch (e) {
    console.error(`mimeData.json is not valid JSON: ${e.message}`)
    process.exit(1)
}

if (!Array.isArray(data)) {
    console.error("mimeData.json must contain a top-level array")
    process.exit(1)
}

// --- shape ---------------------------------------------------------------
for (const entry of data) {
    const name = entry && entry.name ? entry.name : "<unnamed entry>"

    if (typeof entry.name !== "string" || !entry.name.trim()) {
        err(name, "missing a string `name`")
        continue
    }
    if (
        !/^[a-z0-9][a-z0-9!#$&^_.+-]*\/[a-zA-Z0-9!#$&^_.+-]+$/.test(entry.name)
    ) {
        if (KNOWN_MALFORMED_NAMES.has(entry.name)) {
            warn(
                `${entry.name}: not a well-formed \`type/subtype\` (known, allowed)`,
            )
        } else {
            err(entry.name, "name is not a well-formed `type/subtype`")
        }
    }
    if (entry.name !== entry.name.toLowerCase()) {
        err(
            entry.name,
            "name contains uppercase; page paths are case-sensitive and every " +
                "other entry is lowercase",
        )
    }
    /**
     * Descriptions are Markdown, rendered to React elements on the server.
     *
     * They used to be raw HTML injected with dangerouslySetInnerHTML, which
     * made a malicious pull request against this file a stored-XSS route (#4).
     * The renderer no longer parses embedded HTML, so a tag here would show up
     * as literal text on the page rather than execute — but rejecting it
     * outright keeps the data honest and the intent obvious to contributors.
     */
    if (typeof entry.description === "string") {
        const tag = entry.description.match(/<\s*\/?\s*[a-zA-Z][^>]*>/)
        if (tag) {
            err(
                entry.name,
                `description contains HTML (${tag[0]}). Descriptions are ` +
                    "Markdown: use **bold**, `code`, [text](/link) and a blank " +
                    "line between paragraphs.",
            )
        }
    }

    if (!Array.isArray(entry.fileTypes)) {
        err(entry.name, "`fileTypes` must be an array")
    } else {
        for (const ext of entry.fileTypes) {
            if (!/^\.[A-Za-z0-9._+-]+$/.test(ext)) {
                err(
                    entry.name,
                    `file extension "${ext}" should look like ".ext"`,
                )
            }
        }
    }

    if (!entry.links || typeof entry.links !== "object") {
        err(entry.name, "`links` object is missing")
    } else {
        for (const key of LINK_KEYS) {
            if (!Array.isArray(entry.links[key])) {
                err(entry.name, `links.${key} must be an array`)
                continue
            }
            if (entry.links[key].includes(entry.name)) {
                err(entry.name, `links.${key} refers to itself`)
            }
        }
    }

    if (!entry.notices || typeof entry.notices !== "object") {
        err(entry.name, "`notices` object is missing")
    } else {
        for (const flag of ["hasNoOfficial", "communityContributed"]) {
            if (typeof entry.notices[flag] !== "boolean") {
                err(entry.name, `notices.${flag} must be a boolean`)
            }
        }
        if (!("popularUsage" in entry.notices)) {
            err(
                entry.name,
                "notices.popularUsage must be present (string or null)",
            )
        }
    }

    if (entry.furtherReading !== undefined) {
        if (!Array.isArray(entry.furtherReading)) {
            err(entry.name, "`furtherReading` must be an array")
        } else {
            for (const ref of entry.furtherReading) {
                if (
                    !ref ||
                    typeof ref.title !== "string" ||
                    typeof ref.url !== "string"
                ) {
                    err(
                        entry.name,
                        "furtherReading entries need a title and url",
                    )
                    continue
                }
                let url
                try {
                    url = new URL(ref.url)
                } catch {
                    err(
                        entry.name,
                        `furtherReading url is not a valid URL: ${ref.url}`,
                    )
                    continue
                }
                if (url.protocol !== "https:" && url.protocol !== "http:") {
                    err(
                        entry.name,
                        `furtherReading url must be http(s): ${ref.url}`,
                    )
                }
                if (url.username || url.password) {
                    err(
                        entry.name,
                        `furtherReading url must not embed credentials`,
                    )
                }
            }
        }
    }

    for (const key of Object.keys(entry)) {
        if (!KNOWN_KEYS.has(key)) {
            warn(`${entry.name}: unrecognised key "${key}"`)
        }
    }
}

// --- duplicate names -----------------------------------------------------
const seen = new Map()
for (const entry of data) {
    if (typeof entry.name !== "string") continue
    const key = entry.name.toLowerCase()
    if (seen.has(key)) {
        err(entry.name, `duplicate entry (also defined as "${seen.get(key)}")`)
    } else {
        seen.set(key, entry.name)
    }
}

// --- page path collisions ------------------------------------------------
const owners = new Map()
const claim = (pagePath, owner, via) => {
    if (!owners.has(pagePath)) owners.set(pagePath, [])
    owners.get(pagePath).push(`${owner} (${via})`)
}

for (const entry of data) {
    if (typeof entry.name !== "string" || !entry.links) continue
    claim(entry.name, entry.name, "canonical")
    for (const key of ["deprecates", "parentOf", "alternativeTo"]) {
        for (const target of entry.links[key] || []) {
            claim(target, entry.name, key)
        }
    }
}

const collisions = [...owners.entries()].filter(([, v]) => v.length > 1)

// --- report --------------------------------------------------------------
console.log(`Validated ${data.length} mimetype entries.`)

if (warnings.length) {
    console.log(`\n${warnings.length} warning(s):`)
    for (const w of warnings) console.log(`  - ${w}`)
}

if (collisions.length) {
    console.log(
        `\n${collisions.length} page path(s) generated more than once ` +
            `(baseline ${COLLISION_BASELINE}):`,
    )
    for (const [pagePath, claimants] of collisions) {
        console.log(`  - /${pagePath}  <-  ${claimants.join(", ")}`)
    }
}

if (collisions.length > COLLISION_BASELINE) {
    errors.push(
        `page path collisions rose from ${COLLISION_BASELINE} to ${collisions.length}. ` +
            `Each collision means one entry's page silently overwrites another's. ` +
            `Prefer "relatedTo" for cross-references between types that both have ` +
            `their own entry, since it does not generate pages.`,
    )
}

if (errors.length) {
    console.error(`\n${errors.length} error(s):`)
    for (const e of errors) console.error(`  - ${e}`)
    process.exit(1)
}

console.log("\nData validation passed.")
