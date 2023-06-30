import * as React from "react"
import Seo from "../shared/seo"
import { MainLayout } from "../shared/MainLayout/MainLayout"
import { Fit } from "../shared/Fit/Fit"

const NotFoundPage = () => (
    <MainLayout title={"404"} header footer>
        <Fit>
            <div className={"flex flex-col gap-4 py-8 text-center"}>
                <h1 className={"text-3xl"}>404 not found</h1>
                <div>
                    Sorry! Good thing we're open source though right? Go put
                    something here!
                </div>
                <div className={"text-sm"}>
                    If you just tried a mimetype and got here... we _really_
                    wanna know about it...
                </div>
            </div>
        </Fit>
    </MainLayout>
)

export const Head = () => <Seo title="404: Not Found" />

export default NotFoundPage
