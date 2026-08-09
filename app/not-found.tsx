import type { Metadata } from "next"
import { MainLayout } from "@/components/MainLayout"
import { Fit } from "@/components/Fit"

export const metadata: Metadata = {
    title: "404: Not Found | mimetype.io",
    description:
        "Find mimetypes, alternatives, and lookup resources easily in your browser.",
}

export default function NotFound() {
    return (
        <MainLayout header footer>
            <Fit>
                <div className={"flex flex-col gap-4 py-8 text-center"}>
                    <h1 className={"text-3xl"}>404 not found</h1>
                    <div>
                        Sorry! Good thing we&apos;re open source though right?
                        Go put something here!
                    </div>
                    <div className={"text-sm"}>
                        If you just tried a mimetype and got here... we _really_
                        wanna know about it...
                    </div>
                </div>
            </Fit>
        </MainLayout>
    )
}
