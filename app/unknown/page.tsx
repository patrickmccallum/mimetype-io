import type { Metadata } from "next"
import { IconFileUnknown } from "@tabler/icons-react"
import { MainLayout } from "@/components/MainLayout"
import { Fit } from "@/components/Fit"
import { SITE_URL } from "@/lib/pages"

export const metadata: Metadata = {
    title: "Unknown mimetype | mimetype.io",
    description:
        "We don't know this mimetype yet — help us add it to mimetype.io.",
    alternates: { canonical: `${SITE_URL}/unknown` },
}

export default function UnknownPage() {
    return (
        <MainLayout header footer>
            <Fit>
                <div
                    className={
                        "flex flex-col items-center gap-4 text-center text-slate-700"
                    }
                >
                    <IconFileUnknown size={80} className={"my-8"} />
                    <div className={"flex flex-col gap-4"}>
                        <h1 className={"text-4xl font-bold"}>
                            Ok, that&apos;s a new one...
                        </h1>
                        <div>
                            <p>
                                We don&apos;t know what this mimetype is, but
                                we&apos;d love to add it to the site! Submit a
                                PR on Github maybe?
                            </p>
                        </div>
                    </div>
                </div>
            </Fit>
        </MainLayout>
    )
}
