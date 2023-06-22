import * as React from "react"
import Seo from "../shared/seo"
import { MainLayout } from "../shared/MainLayout/MainLayout"

export const IndexPage = () => {
    return (
        <MainLayout title={"Mimetype.io"} header>
            We've been having very strange and serious DNS issues. We hope to
            have the site fully restored within 12 hours. In the meantime you
            can access mimetype information with the URL scheme.
        </MainLayout>
    )
}

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = () => <Seo title="Home" />

export default IndexPage
