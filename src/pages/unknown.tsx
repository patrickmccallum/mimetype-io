import * as React from "react"
import { MainLayout } from "../shared/MainLayout/MainLayout"
import { Fit } from "../shared/Fit/Fit"
import { IconFileUnknown } from "@tabler/icons-react"

export default function IndexPage() {
    return (
        <MainLayout header footer title={"Unknown mimetype"}>
            <Fit>
                <div
                    className={
                        "flex flex-col items-center gap-4 text-center text-slate-700"
                    }
                >
                    <IconFileUnknown size={80} className={"my-8"} />
                    <div className={"flex flex-col gap-4"}>
                        <h1 className={"text-4xl font-bold"}>
                            Ok, that's a new one...
                        </h1>
                        <div>
                            <p>
                                We don't know what this mimetype is, but we'd
                                love to add it to the site! Submit a PR on
                                Github maybe?
                            </p>
                        </div>
                    </div>
                </div>
            </Fit>
        </MainLayout>
    )
}
