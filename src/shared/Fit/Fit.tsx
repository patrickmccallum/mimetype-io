import * as React from "react"
import { PropsWithChildren } from "react"

export const Fit = ({ children }: PropsWithChildren) => {
    return (
        <div className={"mx-auto w-full max-w-screen-lg px-4"}>{children}</div>
    )
}
