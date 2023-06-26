/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-config/
 */

/**
 * @type {import("gatsby").GatsbyConfig}
 */
module.exports = {
    siteMetadata: {
        title: `mimetype.io`,
        description: `Find mimetypes, alternatives, and lookup resources easily in your browser.`,
        author: `@patsnacks`,
        siteUrl: `https://mimetype.io/`,
    },
    trailingSlash: "never",
    plugins: [
        {
            resolve: `gatsby-plugin-google-gtag`,
            options: {
                trackingIds: [
                    "G-XPG13CGVHN", // Google Analytics / GA
                ],
                // This object is used for configuration specific to this plugin
                pluginConfig: {
                    // Puts tracking script in the head instead of the body
                    head: true,
                    // Apparently needed (bug)
                    anonymize_ip: true,
                    // Setting this parameter is also optional
                    respectDNT: true,
                    // Delays processing pageview events on route update (in milliseconds)
                    delayOnRouteUpdate: 0,
                },
            },
        },
        `gatsby-plugin-react-helmet`,
        `gatsby-plugin-image`,
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `images`,
                path: `${__dirname}/src/images`,
            },
        },
        `gatsby-transformer-sharp`,
        `gatsby-plugin-sharp`,
        {
            resolve: `gatsby-plugin-google-fonts`,
            options: {
                fonts: [`Merriweather`, `Open Sans`],
            },
        },
        {
            resolve: `gatsby-plugin-manifest`,
            options: {
                name: `mimetype.io`,
                short_name: `mimetype.io`,
                start_url: `/`,
                background_color: `#FFF`,
                // This will impact how browsers show your PWA/website
                // https://css-tricks.com/meta-theme-color-and-trickery/
                // theme_color: `#663399`,
                display: `minimal-ui`,
                icon: `src/images/icon.png`, // This path is relative to the root of the site.
            },
        },
    ],
}
