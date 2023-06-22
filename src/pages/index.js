import * as React from "react"
import Seo from "../shared/seo"
import {MainLayout} from "../shared/MainLayout/MainLayout";

export const IndexPage = () => {
    return <MainLayout title={"Mimetype.io"} header>
        Home
    </MainLayout>
};

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = () => <Seo title="Home"/>

export default IndexPage
