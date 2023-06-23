import * as React from "react"
import { MainLayout } from "../shared/MainLayout/MainLayout"
import { Fit } from "../shared/Fit/Fit"
import { IconFileUnknown } from "@tabler/icons-react"

export default function IndexPage() {
    return (
        <MainLayout header footer title={"Unknown mimetype"}>
            <Fit>
                <IconFileUnknown />
                <div className={"flex flex-col gap-4"}>
                    <h1 className={"text-4xl font-bold text-slate-700"}>
                        Ok, that's a new one...
                    </h1>
                    <div>
                        <p className={"text-slate-500"}>
                            We don't know what this mimetype is, but we'd love
                            to add it to the site!
                        </p>
                        <p className={"text-slate-5005"}>
                            Why not tell us about it?
                        </p>
                    </div>
                </div>
            </Fit>
        </MainLayout>
    )
}
