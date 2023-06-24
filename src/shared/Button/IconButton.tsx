import * as React from "react"
import * as classNames from "classnames"
import { PropsWithChildren } from "react"

interface IconButtonProps {
    onClick?: () => void
    size?: "sm" | "md" | "lg"
    title?: string
    outlined?: boolean
}

export const IconButton = ({
    onClick,
    size = "md",
    outlined = false,
    children,
    title,
}: PropsWithChildren<IconButtonProps>) => {
    return (
        <button
            title={title}
            className={classNames(
                "rounded-lg bg-transparent bg-white text-slate-500 hover:bg-slate-200 hover:text-slate-600",
                {
                    "p-3 text-lg": size === "lg",
                    "text-md p-3": size === "md",
                    "p-2 text-sm": size === "sm",
                    "border border-gray-200": outlined,
                }
            )}
            onClick={onClick}
        >
            {children}
        </button>
    )
}
