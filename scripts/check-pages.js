#!/usr/bin/env node
/**
 * Smoke test for the built site in public/.
 *
 * Run after `gatsby build`. Asserts that pages were actually emitted, that
 * their rendered HTML contains the content we expect (rather than an empty
 * shell), and that the data Gatsby handed each page matches src/mimeData.json.
 */

const fs = require("fs")
const path = require("path")

const ROOT = path.join(__dirname, "..")
const PUBLIC = path.join(ROOT, "public")
const data = require(path.join(ROOT, "src", "mimeData.json"))

/**
 * Pages that currently render another entry's description.
 *
 * Each of these is the target of a mutual `deprecates` pair (issue #67), so
 * gatsby-node.js generates the page twice and the second write wins. They are
 * recorded here so the suite stays green on master while still failing if a
 * change damages any *other* page the same way. Delete entries from this list
 * as the underlying pairs are untangled.
 */
const KNOWN_OVERWRITTEN = new Set([
    "application/ecmascript",
    "application/pkcs7-mime",
    "application/vnd.rar",
    "application/x-rar-compressed",
])

const failures = []
let checks = 0

const check = (label, condition, detail) => {
    checks++
    if (!condition) failures.push(detail ? `${label}\n      ${detail}` : label)
}

const readPage = pagePath => {
    const file = path.join(PUBLIC, pagePath, "index.html")
    return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : null
}

const readContext = pagePath => {
    const file = path.join(PUBLIC, "page-data", pagePath, "page-data.json")
    if (!fs.existsSync(file)) return null
    try {
        return JSON.parse(fs.readFileSync(file, "utf8")).result.pageContext
    } catch {
        return null
    }
}

// --- build output exists -------------------------------------------------
if (!fs.existsSync(PUBLIC)) {
    console.error("public/ does not exist. Run `npm run build` first.")
    process.exit(1)
}

const emitted = []
const walk = dir => {
    for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, item.name)
        if (item.isDirectory()) walk(full)
        else if (item.name === "index.html") emitted.push(full)
    }
}
walk(PUBLIC)

check(
    `emitted at least as many pages as there are entries (${data.length})`,
    emitted.length >= data.length,
    `found ${emitted.length} index.html files`,
)

// --- static pages --------------------------------------------------------
for (const staticPage of ["", "all-types", "unknown", "404"]) {
    const html = readPage(staticPage)
    check(`static page /${staticPage} was emitted`, html !== null)
    if (html) {
        check(
            `static page /${staticPage} has a non-empty <title>`,
            /<title[^>]*>[^<]+<\/title>/.test(html),
        )
    }
}

// --- every canonical entry has a page ------------------------------------
const missing = []
for (const entry of data) {
    if (readPage(entry.name) === null) missing.push(entry.name)
}
check(
    "every mimetype entry produced a page",
    missing.length === 0,
    missing.length ? `missing: ${missing.slice(0, 10).join(", ")}` : "",
)

// --- generated (deprecates / parentOf / alternativeTo) pages --------------
const generated = new Set()
for (const entry of data) {
    for (const key of ["deprecates", "parentOf", "alternativeTo"]) {
        for (const target of entry.links[key] || []) generated.add(target)
    }
}
const missingGenerated = [...generated].filter(t => readPage(t) === null)
check(
    "every cross-referenced type produced a page",
    missingGenerated.length === 0,
    missingGenerated.length
        ? `missing: ${missingGenerated.slice(0, 10).join(", ")}`
        : "",
)

// --- page context matches source data ------------------------------------
const contextMismatches = []
for (const entry of data) {
    const ctx = readContext(entry.name)
    if (!ctx) {
        contextMismatches.push(`${entry.name}: no page-data.json`)
        continue
    }
    if (ctx.name !== entry.name) {
        contextMismatches.push(`${entry.name}: context name is "${ctx.name}"`)
    }
    if (
        (ctx.description || "") !== (entry.description || "") &&
        !KNOWN_OVERWRITTEN.has(entry.name)
    ) {
        contextMismatches.push(
            `${entry.name}: description does not match source (page may have ` +
                `been overwritten by another entry)`,
        )
    }
}
check(
    "each page received its own entry's data",
    contextMismatches.length === 0,
    contextMismatches.slice(0, 5).join("\n      "),
)

// --- rendered content ----------------------------------------------------
/**
 * Reduce markup to comparable plain text.
 *
 * Descriptions may contain inline markup and are re-encoded on the way into the
 * HTML (apostrophes become entities, tags gain attributes). Comparing raw
 * strings gives false negatives for any description that opens with a link, so
 * both sides are stripped of markup and punctuation and lowercased first.
 */
const plainText = s =>
    s
        .replace(/<script[\s\S]*?<\/script>/g, " ")
        .replace(/<style[\s\S]*?<\/style>/g, " ")
        .replace(/<[^>]*>/g, " ")
        .replace(/&[a-z]+;|&#x?[0-9a-f]+;/gi, " ")
        .replace(/[^a-z0-9 ]/gi, " ")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase()

const withDescription = data.filter(e => e.description && e.description.trim())
const notRendered = []
for (const entry of withDescription) {
    if (KNOWN_OVERWRITTEN.has(entry.name)) continue
    const html = readPage(entry.name)
    if (!html) continue
    const fragment = plainText(entry.description).slice(0, 40)
    const body = plainText(html.split("</head>")[1] || html)
    if (fragment && !body.includes(fragment)) {
        notRendered.push(entry.name)
    }
}
check(
    "descriptions are rendered into the HTML",
    notRendered.length === 0,
    notRendered.length
        ? `not found in: ${notRendered.slice(0, 5).join(", ")}`
        : "",
)

// --- no template leakage -------------------------------------------------
const leaky = []
for (const entry of data.slice(0, 200)) {
    const html = readPage(entry.name)
    if (!html) continue
    const body = html.replace(/<script[\s\S]*?<\/script>/g, "")
    if (/\[object Object\]|>undefined<|>NaN</.test(body)) leaky.push(entry.name)
}
check(
    "no undefined / [object Object] leaked into rendered pages",
    leaky.length === 0,
    leaky.length ? `found in: ${leaky.slice(0, 5).join(", ")}` : "",
)

// --- titles are unique and meaningful ------------------------------------
const blankTitles = []
for (const entry of data.slice(0, 200)) {
    const html = readPage(entry.name)
    if (!html) continue
    const m = html.match(/<title[^>]*>([^<]*)<\/title>/)
    if (!m || !m[1].trim()) blankTitles.push(entry.name)
    else if (!m[1].includes(entry.name))
        blankTitles.push(`${entry.name} (title: "${m[1]}")`)
}
check(
    "mimetype pages have a title containing their type",
    blankTitles.length === 0,
    blankTitles.length ? `problems: ${blankTitles.slice(0, 5).join(", ")}` : "",
)

// --- client bundle present ----------------------------------------------
const home = readPage("")
check(
    "home page references a JS bundle (client runtime shipped)",
    home !== null && /<script[^>]+src="[^"]*\.js"/.test(home),
)

// --- SEO: sitemap and robots ---------------------------------------------
const sitemapIndex = path.join(PUBLIC, "sitemap-index.xml")
const sitemapUrls = new Set()
if (fs.existsSync(sitemapIndex)) {
    for (const file of fs.readdirSync(PUBLIC)) {
        if (!/^sitemap-\d+\.xml$/.test(file)) continue
        const xml = fs.readFileSync(path.join(PUBLIC, file), "utf8")
        for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
            sitemapUrls.add(m[1].replace(/^https?:\/\/[^/]+/, "") || "/")
        }
    }
}

check("a sitemap index was emitted", fs.existsSync(sitemapIndex))

const notInSitemap = data
    .map(e => `/${e.name}`)
    .filter(p => !sitemapUrls.has(p))
check(
    "every mimetype page appears in the sitemap",
    notInSitemap.length === 0,
    notInSitemap.length
        ? `missing ${notInSitemap.length}, e.g. ${notInSitemap.slice(0, 5).join(", ")}`
        : "",
)

check(
    "the sitemap does not advertise 404 pages",
    ![...sitemapUrls].some(u => u.startsWith("/404")),
)

const robots = path.join(PUBLIC, "robots.txt")
check("robots.txt was emitted", fs.existsSync(robots))
check(
    "robots.txt points at the sitemap index",
    fs.existsSync(robots) &&
        /^\s*Sitemap:\s*https?:\/\/\S+sitemap-index\.xml\s*$/m.test(
            fs.readFileSync(robots, "utf8"),
        ),
)

// --- SEO: per-page head tags ---------------------------------------------
const headProblems = []
for (const entry of data) {
    const html = readPage(entry.name)
    if (!html) continue
    const head = html.split("</head>")[0]
    const grab = re => {
        const m = head.match(re)
        return m ? m[1] : null
    }

    const canonical = grab(/rel="canonical" href="([^"]*)"/)
    if (!canonical) headProblems.push(`${entry.name}: no canonical`)
    else if (canonical.replace(/^https?:\/\/[^/]+/, "") !== `/${entry.name}`) {
        headProblems.push(`${entry.name}: canonical points at ${canonical}`)
    }

    if (!grab(/name="description" content="([^"]+)"/)) {
        headProblems.push(`${entry.name}: no meta description`)
    }
    if (!grab(/property="og:title" content="([^"]+)"/)) {
        headProblems.push(`${entry.name}: no og:title`)
    }
}
check(
    "every mimetype page has a self-referencing canonical, description and og:title",
    headProblems.length === 0,
    headProblems.slice(0, 5).join("\n      "),
)

// --- SEO: pages must not wrongly advertise themselves as deprecated -------
/**
 * Canonical entries whose page currently renders a "this mimetype is
 * deprecated" banner because another entry lists them under `deprecates`.
 *
 * These are the mutually-deprecating pairs from issue #67. /application/zip
 * telling readers to prefer application/zip-compressed is the most damaging:
 * it demotes the IANA-registered type in favour of a non-standard one. Recorded
 * so the count can only go down; any new page joining this list fails the build.
 */
const KNOWN_SELF_DEPRECATED = new Set([
    "application/ecmascript",
    "application/x-gzip",
    "application/mathml+xml",
    "application/x-font-otf",
    "application/x-pkcs7-certificates",
    "application/pkcs7-mime",
    "application/vnd.rar",
    "application/zip",
    "application/x-zip-compressed",
])

const selfDeprecated = []
for (const entry of data) {
    const ctx = readContext(entry.name)
    if (!ctx || !ctx.templateData.deprecatedBy) continue
    if (!KNOWN_SELF_DEPRECATED.has(entry.name)) selfDeprecated.push(entry.name)
}
check(
    "no new canonical page advertises itself as deprecated",
    selfDeprecated.length === 0,
    selfDeprecated.length ? `newly affected: ${selfDeprecated.join(", ")}` : "",
)

// --- report --------------------------------------------------------------
console.log(`Ran ${checks} checks against ${emitted.length} built pages.`)

if (failures.length) {
    console.error(`\n${failures.length} failure(s):`)
    for (const f of failures) console.error(`  - ${f}`)
    process.exit(1)
}

console.log("\nPage checks passed.")
