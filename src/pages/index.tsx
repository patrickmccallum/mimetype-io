import * as React from "react"
import { MainLayout } from "../shared/MainLayout/MainLayout"
import { Fit } from "../shared/Fit/Fit"
import { FileDrop } from "../shared/FileDrop/FileDrop"
import Helmet from "react-helmet"

export const IndexPage = () => {
    return (
        <MainLayout title={"Mimetype.io"} header footer>
            <Helmet>
                <title>mimetype.io - The great mimetype resource</title>
                <meta
                    name="description"
                    content={`Find MIME types, related extensions, alternatives, and resources.`}
                />
                <meta
                    property="og:title"
                    content={`mimetype.io - The great mimetype resource`}
                />
                <meta
                    property="og:description"
                    content={`Find MIME types, see related extensions, alternatives, and resources.`}
                />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={`https://mimetype.io/`} />
                <meta
                    property="twitter:title"
                    content={`mimetype.io - The great mimetype resource`}
                />
                <meta
                    property="twitter:description"
                    content={`Find MIME types, see related extensions, alternatives, and resources.`}
                />
            </Helmet>
            <Fit>
                <FileDrop />
            </Fit>
        </MainLayout>
    )
}

export default IndexPage
