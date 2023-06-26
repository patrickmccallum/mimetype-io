import * as React from "react"
import { MainLayout } from "../shared/MainLayout/MainLayout"
import { Fit } from "../shared/Fit/Fit"
import { FileDrop } from "../shared/FileDrop/FileDrop"
import Helmet from "react-helmet"

export const IndexPage = () => {
    return (
        <MainLayout title={"Mimetype.io"} header footer>
            <Helmet>
                <title>mimetype.io - Check MIME types from files</title>
                <meta
                    name="description"
                    content={`Check a files MIME type, related extensions, alternatives, and resources.`}
                />
                <meta
                    property="og:title"
                    content={`mimetype.io - Check MIME types from files`}
                />
                <meta
                    property="og:description"
                    content={`Check a files MIME type, related extensions, alternatives, and resources.`}
                />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={`https://mimetype.io/`} />
                <meta
                    property="twitter:title"
                    content={`mimetype.io - Check MIME types from files`}
                />
                <meta
                    property="twitter:description"
                    content={`Check a files MIME type, related extensions, alternatives, and resources.`}
                />
            </Helmet>
            <Fit>
                <FileDrop />
            </Fit>
        </MainLayout>
    )
}

export default IndexPage
