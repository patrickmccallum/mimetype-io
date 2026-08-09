import rawData from "@/src/mimeData.json"
import type { MimeData } from "@/src/types/mimeData"

export const SITE_URL = "https://mimetype.io"
export const OG_IMAGE = `${SITE_URL}/og-image.png`

export type MimeEntry = Omit<MimeData, "templateData">

export const allEntries = rawData as unknown as MimeEntry[]

/**
 * Every page the site publishes, keyed by its path (without a leading slash).
 *
 * This deliberately reproduces the behaviour of the Gatsby `gatsby-node.js`
 * it replaces, rather than improving on it:
 *
 *   - a page is created for each entry, and additionally for every name listed
 *     under that entry's `deprecates`, `parentOf` and `alternativeTo` links
 *   - when two entries claim the same path, the later one in the array wins,
 *     matching Gatsby's createPage overwrite semantics
 *
 * That overwrite is the cause of the nine self-deprecating pages tracked in
 * issue #67 (/application/zip currently tells readers it is deprecated in
 * favour of application/zip-compressed). It is preserved here on purpose so
 * that this rewrite is output-preserving and can be diffed against the Gatsby
 * build. Fixing it is a data change in mimeData.json, not a rendering change.
 */
export type PageData = MimeEntry & {
    templateData: {
        parentType: string | null
        deprecatedBy: string | null
    }
}

function buildPages(): Map<string, PageData> {
    const pages = new Map<string, PageData>()

    for (const entry of allEntries) {
        pages.set(entry.name, {
            ...entry,
            templateData: { deprecatedBy: null, parentType: null },
        })

        for (const deprecated of entry.links.deprecates ?? []) {
            pages.set(deprecated, {
                ...entry,
                name: deprecated,
                templateData: {
                    deprecatedBy: entry.name,
                    parentType: entry.name,
                },
            })
        }

        for (const child of entry.links.parentOf ?? []) {
            pages.set(child, {
                ...entry,
                name: child,
                templateData: { deprecatedBy: null, parentType: entry.name },
            })
        }

        for (const alternative of entry.links.alternativeTo ?? []) {
            pages.set(alternative, {
                ...entry,
                name: alternative,
                templateData: { deprecatedBy: null, parentType: null },
                links: {
                    ...entry.links,
                    relatedTo: [
                        entry.name,
                        ...entry.links.relatedTo.filter(m => m !== alternative),
                    ],
                    alternativeTo: [
                        entry.name,
                        ...entry.links.alternativeTo.filter(
                            m => m !== alternative,
                        ),
                    ],
                },
            })
        }
    }

    return pages
}

export const mimePages = buildPages()

export const allMimePaths = [...mimePages.keys()]

/**
 * Resolves a route path back to its page.
 *
 * 61 of the ~690 types contain a `+` (application/atom+xml,
 * application/x-ipynb+json, and every other structured-syntax suffix). Route
 * params do not always arrive with that `+` intact — depending on how the
 * segment was decoded it can come back as a space or percent-encoded — so a
 * plain Map lookup silently 404s roughly 9% of the site.
 *
 * Rather than guess which form applies, try the candidates in order of how
 * likely they are to be correct. All variants collapse to the same key, so a
 * mismatch here can only ever resolve to the intended page.
 */
export function getMimePage(path: string): PageData | undefined {
    const candidates = [path]

    // A `+` decoded as a space (application/x-www-form-urlencoded semantics).
    if (path.includes(" ")) candidates.push(path.replace(/ /g, "+"))

    // A percent-encoded segment that was not decoded for us.
    if (path.includes("%")) {
        try {
            const decoded = decodeURIComponent(path)
            candidates.push(decoded, decoded.replace(/ /g, "+"))
        } catch {
            // Malformed escape sequence: fall through to the remaining forms.
        }
    }

    for (const candidate of candidates) {
        const page = mimePages.get(candidate)
        if (page) return page
    }

    return undefined
}
