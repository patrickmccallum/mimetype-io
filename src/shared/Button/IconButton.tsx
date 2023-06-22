import * as React from "react"
import * as classNames from "classnames"
import { PropsWithChildren } from "react"

interface IconButtonProps {
    onClick?: () => void
    size?: "sm" | "md" | "lg"
    title?: string
}

export const IconButton = ({
    onClick,
    size = "md",
    children,
    title,
}: PropsWithChildren<IconButtonProps>) => {
    return (
        <button
            title={title}
            className={classNames(
                "bg-transparent¬ rounded-full text-slate-500 hover:bg-slate-200 hover:text-slate-600",
                {
                    "p-4 text-lg": size === "lg",
                    "text-md p-3": size === "md",
                    "p-2 text-sm": size === "sm",
                }
            )}
            onClick={onClick}
        >
            {children}
        </button>
    )
}
