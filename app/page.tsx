import type { Metadata } from "next"
import { MainLayout } from "@/components/MainLayout"
import { Fit } from "@/components/Fit"
import { FileDrop } from "@/components/FileDrop"
import { SITE_URL, OG_IMAGE } from "@/lib/pages"

const title = "mimetype.io - Check MIME types from files"
const description =
    "Check a files MIME type, related extensions, alternatives, and resources."

export const metadata: Metadata = {
    title,
    description,
    alternates: { canonical: SITE_URL },
    openGraph: {
        title,
        description,
        type: "website",
        url: `${SITE_URL}/`,
        images: [OG_IMAGE],
    },
    twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [OG_IMAGE],
    },
}

export default function HomePage() {
    return (
        <MainLayout header footer>
            <Fit>
                <h1 className={"sr-only"}>
                    mimetype.io — check MIME types from files
                </h1>
                <FileDrop />
            </Fit>
        </MainLayout>
    )
}
