import type { PropsWithChildren } from "react"
import { Fit } from "./Fit"
import { Header } from "./Header"
import { Footer } from "./Footer"

interface MainLayoutProps {
    header?: boolean
    footer?: boolean
}

export const MainLayout = ({
    children,
    header,
    footer,
}: PropsWithChildren<MainLayoutProps>) => {
    return (
        <div
            className={
                "flex h-full min-h-screen w-full flex-1 flex-col bg-white"
            }
        >
            {header && (
                <div className={"mb-4 border-b border-slate-100 bg-gray-50"}>
                    <Fit>
                        <Header />
                    </Fit>
                </div>
            )}
            <main className={"flex flex-col items-stretch"}>{children}</main>
            {footer && (
                <Fit>
                    <Footer />
                </Fit>
            )}
        </div>
    )
}
