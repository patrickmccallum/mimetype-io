import * as React from "react"
import { PropsWithChildren } from "react"
import * as classNames from "classnames"

interface SecondaryButtonProps {
    size?: "sm" | "md" | "lg"
    onClick?: () => void
    className?: string
}

export const SecondaryButton = ({
    children,
    size = "md",
    className,
    onClick,
}: PropsWithChildren<SecondaryButtonProps>) => {
    return (
        <button
            onClick={onClick}
            className={classNames(
                "hover:white flex items-center rounded-md border border-slate-300 bg-slate-50 text-slate-800 shadow-sm transition-all duration-100 hover:bg-slate-100 hover:text-slate-600 hover:shadow",
                {
                    "gap-2 px-4 py-2 text-sm": size === "lg",
                    "gap-2 px-3 py-1 text-sm": size === "md",
                    "gap-1 px-2 py-1 text-xs": size === "sm",
                },
                className
            )}
        >
            {children}
        </button>
    )
}
