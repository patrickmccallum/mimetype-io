import type { PropsWithChildren } from "react"
import classNames from "classnames"

interface IconButtonProps {
    size?: "sm" | "md" | "lg"
    title?: string
    outlined?: boolean
}

export const IconButton = ({
    size = "md",
    outlined = false,
    children,
    title,
}: PropsWithChildren<IconButtonProps>) => {
    return (
        <span
            title={title}
            className={classNames(
                "inline-flex rounded-lg bg-transparent text-slate-500 hover:bg-slate-200 hover:text-slate-600",
                {
                    "p-3 text-lg": size === "lg",
                    "text-md p-3": size === "md",
                    "p-2 text-sm": size === "sm",
                    "border border-gray-300": outlined,
                },
            )}
        >
            {children}
        </span>
    )
}
