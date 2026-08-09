import type { NextConfig } from "next"

const nextConfig: NextConfig = {
    // The site is fully static. `export` writes plain HTML to out/, which keeps
    // the deployment model identical to the Gatsby build it replaces and lets
    // the page checks in scripts/check-pages.js assert against real files.
    output: "export",

    // Gatsby was configured with trailingSlash: "never". Static export needs
    // a directory per route to serve /application/zip without a slash, so
    // pages are emitted as out/application/zip/index.html.
    trailingSlash: false,

    // No next/image optimisation is possible under static export, and the site
    // ships a single icon, so this is a no-op made explicit.
    images: { unoptimized: true },

    typedRoutes: false,
}

export default nextConfig
