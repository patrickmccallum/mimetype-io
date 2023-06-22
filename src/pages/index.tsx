import * as React from "react"
import Seo from "../shared/seo"
import { MainLayout } from "../shared/MainLayout/MainLayout"
import { Fit } from "../shared/Fit/Fit"

export const IndexPage = () => {
    return (
        <MainLayout title={"Mimetype.io"} header footer>
            <Fit>
                We've been having very strange and serious DNS issues. We hope
                to have the site fully restored within 12 hours. In the meantime
                you can access mimetype information with the URL scheme.
            </Fit>
        </MainLayout>
    )
}

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = () => (
    <Seo
        title="Home"
        description={
            "Check a files mimetype instantly, see related extensions, and alternatives it may appear as."
        }
    />
)

export default IndexPage
