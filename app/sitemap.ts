import type { MetadataRoute } from "next"
import { allMimePaths, SITE_URL } from "@/lib/pages"

/**
 * Replaces gatsby-plugin-sitemap.
 *
 * Covers the same URL set it did: the static pages plus every generated
 * mimetype page, including those produced from deprecates / parentOf /
 * alternativeTo links, since those are real URLs people land on. 404s are
 * excluded by simply never being listed.
 */
export const dynamic = "force-static"

export default function sitemap(): MetadataRoute.Sitemap {
    const staticPaths = ["", "all-types", "unknown"]

    return [...staticPaths, ...allMimePaths].map(path => ({
        url: path ? `${SITE_URL}/${path}` : SITE_URL,
    }))
}
