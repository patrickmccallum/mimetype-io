#!/usr/bin/env node
/**
 * Smoke test for the static export in out/.
 *
 * Run after `next build`. Asserts that every expected page was emitted, that
 * each one rendered its *own* entry's data rather than another's, that the
 * rendered HTML carries the SEO tags the site depends on, and that the sitemap
 * and robots.txt line up with the pages actually produced.
 *
 * `next.config.ts` sets trailingSlash: false, so static export writes a flat
 * `<path>.html` per route rather than `<path>/index.html`. Only the site root
 * gets an index.html.
 */

const fs = require("fs")
const path = require("path")

const ROOT = path.join(__dirname, "..")
const OUT = path.join(ROOT, "out")
const data = require(path.join(ROOT, "src", "mimeData.json"))

const SITE_URL = "https://mimetype.io"

/**
 * Pages that render another entry's description.
 *
 * Each is the target of a mutual `deprecates` pair (issue #67), so the page is
 * generated twice and the later write wins. Recorded so the suite stays green
 * while still failing if a change damages any *other* page the same way.
 */
const KNOWN_OVERWRITTEN = new Set([
    "application/ecmascript",
    "application/pkcs7-mime",
    "application/vnd.rar",
    "application/x-rar-compressed",
])

/**
 * Canonical entries whose page renders a "this mimetype is deprecated" banner,
 * for the same reason. /application/zip telling readers to prefer
 * application/zip-compressed is the most damaging of these. The count may only
 * go down.
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

const failures = []
let checks = 0

const check = (label, condition, detail) => {
    checks++
    if (!condition) failures.push(detail ? `${label}\n      ${detail}` : label)
}

const readPage = pagePath => {
    const file = pagePath
        ? path.join(OUT, `${pagePath}.html`)
        : path.join(OUT, "index.html")
    return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : null
}

/**
 * Rebuilds the page set exactly as lib/pages.ts does, so the checker verifies
 * the build rather than trusting it.
 */
const buildExpectedPages = () => {
    const pages = new Map()
    for (const entry of data) {
        pages.set(entry.name, {
            source: entry,
            name: entry.name,
            deprecatedBy: null,
        })
        for (const t of entry.links.deprecates ?? []) {
            pages.set(t, { source: entry, name: t, deprecatedBy: entry.name })
        }
        for (const t of entry.links.parentOf ?? []) {
            pages.set(t, { source: entry, name: t, deprecatedBy: null })
        }
        for (const t of entry.links.alternativeTo ?? []) {
            pages.set(t, { source: entry, name: t, deprecatedBy: null })
        }
    }
    return pages
}

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

// --- build output exists -------------------------------------------------
if (!fs.existsSync(OUT)) {
    console.error("out/ does not exist. Run `npm run build` first.")
    process.exit(1)
}

const expected = buildExpectedPages()

// --- static pages --------------------------------------------------------
for (const staticPage of ["", "all-types", "unknown"]) {
    const html = readPage(staticPage)
    check(`static page /${staticPage} was emitted`, html !== null)
    if (html) {
        check(
            `static page /${staticPage} has a non-empty <title>`,
            /<title[^>]*>[^<]+<\/title>/.test(html),
        )
    }
}

check("a 404 page was emitted", fs.existsSync(path.join(OUT, "404.html")))

// --- every expected mimetype page exists ---------------------------------
const missing = [...expected.keys()].filter(p => readPage(p) === null)
check(
    `every expected mimetype page was emitted (${expected.size})`,
    missing.length === 0,
    missing.length ? `missing: ${missing.slice(0, 10).join(", ")}` : "",
)

// --- each page rendered its own entry's data -----------------------------
const wrongData = []
const notRendered = []
for (const [pagePath, info] of expected) {
    if (KNOWN_OVERWRITTEN.has(pagePath)) continue
    const html = readPage(pagePath)
    if (!html) continue

    const body = plainText(html)

    // The heading must be the page's own type name.
    if (!body.includes(plainText(pagePath))) {
        wrongData.push(`${pagePath}: own name not rendered`)
    }

    const description = info.source.description
    if (description && description.trim()) {
        const fragment = plainText(description).slice(0, 40)
        if (fragment && !body.includes(fragment)) {
            notRendered.push(pagePath)
        }
    }
}
check(
    "each page rendered its own entry's data",
    wrongData.length === 0,
    wrongData.slice(0, 5).join("\n      "),
)
check(
    "descriptions are rendered into the HTML",
    notRendered.length === 0,
    notRendered.length
        ? `not found in: ${notRendered.slice(0, 5).join(", ")}`
        : "",
)

// --- SEO head tags -------------------------------------------------------
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
    if (!grab(/name="twitter:card" content="([^"]+)"/)) {
        headProblems.push(`${entry.name}: no twitter:card`)
    }
    const title = grab(/<title[^>]*>([^<]*)<\/title>/)
    if (!title || !title.includes(entry.name)) {
        headProblems.push(`${entry.name}: title is ${JSON.stringify(title)}`)
    }
}
check(
    "every mimetype page has canonical, description, og:title, twitter:card and a correct title",
    headProblems.length === 0,
    headProblems.slice(0, 5).join("\n      "),
)

// --- sitemap and robots --------------------------------------------------
const sitemapFile = path.join(OUT, "sitemap.xml")
check("a sitemap was emitted", fs.existsSync(sitemapFile))

const sitemapUrls = new Set()
if (fs.existsSync(sitemapFile)) {
    const xml = fs.readFileSync(sitemapFile, "utf8")
    for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
        sitemapUrls.add(m[1].replace(SITE_URL, "") || "/")
    }
}

const notInSitemap = [...expected.keys()].filter(p => !sitemapUrls.has(`/${p}`))
check(
    "every mimetype page appears in the sitemap",
    notInSitemap.length === 0,
    notInSitemap.length
        ? `missing ${notInSitemap.length}, e.g. ${notInSitemap.slice(0, 5).join(", ")}`
        : "",
)
check(
    "the sitemap does not advertise 404 pages",
    ![...sitemapUrls].some(
        u => u.startsWith("/404") || u.includes("_not-found"),
    ),
)

const robotsFile = path.join(OUT, "robots.txt")
check("robots.txt was emitted", fs.existsSync(robotsFile))
check(
    "robots.txt points at the sitemap",
    fs.existsSync(robotsFile) &&
        /^\s*Sitemap:\s*https?:\/\/\S+sitemap\.xml\s*$/im.test(
            fs.readFileSync(robotsFile, "utf8"),
        ),
)

// --- no new page advertises itself as deprecated -------------------------
const selfDeprecated = []
for (const entry of data) {
    const info = expected.get(entry.name)
    if (!info || !info.deprecatedBy) continue
    if (!KNOWN_SELF_DEPRECATED.has(entry.name)) selfDeprecated.push(entry.name)
}
check(
    "no new canonical page advertises itself as deprecated",
    selfDeprecated.length === 0,
    selfDeprecated.length ? `newly affected: ${selfDeprecated.join(", ")}` : "",
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

// --- client runtime shipped ----------------------------------------------
const home = readPage("")
check(
    "home page references a JS bundle (client runtime shipped)",
    home !== null && /<script[^>]+src="[^"]*\.js"/.test(home),
)

// --- report --------------------------------------------------------------
const htmlCount = (function count(dir) {
    let n = 0
    for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, item.name)
        if (item.isDirectory()) n += count(full)
        else if (item.name.endsWith(".html")) n++
    }
    return n
})(OUT)

console.log(`Ran ${checks} checks against ${htmlCount} exported pages.`)

if (failures.length) {
    console.error(`\n${failures.length} failure(s):`)
    for (const f of failures) console.error(`  - ${f}`)
    process.exit(1)
}

console.log("\nPage checks passed.")
