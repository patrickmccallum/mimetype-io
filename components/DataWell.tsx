import type { ReactNode } from "react"
import Link from "next/link"
import classNames from "classnames"
import { CopyButton } from "./Button/CopyButton"
import { EmptyData } from "./EmptyData"

export type DataWellItem = {
    label: string
    linkTo?: string
    endAdornment?: ReactNode
}

export type DataWellItems = Array<DataWellItem>

interface DataWellProps {
    title?: string
    data: DataWellItems
    className?: string
    emptyText?: string
    /**
     * Path of the page this well is rendered on. The Gatsby version read the
     * current location from a module-scoped `globalHistory` import, which is
     * not available (or correct) during static rendering, so the page passes
     * it down instead. Used only to avoid underlining a self-link.
     */
    currentPath?: string
}

export const DataWell = ({
    data,
    className,
    title,
    emptyText = "No data provided",
    currentPath = "",
}: DataWellProps) => {
    const sorted = [...data].sort((a, b) => (a.label < b.label ? -1 : 1))
    const jsonData = sorted.map(item => item.label)

    return (
        <div className={classNames("flex flex-col gap-4", className)}>
            <div
                className={
                    "flex flex-col items-start justify-between gap-4 md:flex-row md:items-center"
                }
            >
                <div>
                    {title && (
                        <h2 className={"text-md font-bold text-slate-500"}>
                            {title}
                        </h2>
                    )}
                </div>

                {sorted.length > 0 && (
                    <div
                        className={
                            "flex items-center gap-2 rounded-lg bg-slate-50"
                        }
                    >
                        <CopyButton
                            data={JSON.stringify(jsonData, null, 4)}
                            label={"Copy as JSON"}
                        />
                        <CopyButton
                            data={jsonData.join("\n")}
                            label={"Copy as is"}
                        />
                    </div>
                )}
            </div>
            {sorted.length === 0 && <EmptyData text={emptyText} />}
            {sorted.length !== 0 && (
                <div
                    className={classNames(
                        "relative flex flex-col overflow-hidden rounded-md bg-slate-200 md:flex-row",
                        className,
                    )}
                >
                    <pre
                        className={
                            "flex-1 p-4 text-sm leading-loose whitespace-break-spaces"
                        }
                    >
                        {sorted.map((item, index) => (
                            <div
                                key={index}
                                className={"flex items-baseline gap-2"}
                            >
                                {item.linkTo ? (
                                    <Link
                                        href={item.linkTo}
                                        className={
                                            !currentPath.includes(item.linkTo)
                                                ? "underline"
                                                : ""
                                        }
                                    >
                                        {item.label}
                                    </Link>
                                ) : (
                                    <div>{item.label}</div>
                                )}
                                {item.endAdornment && (
                                    <div className={"text-xs text-gray-500"}>
                                        {item.endAdornment}
                                    </div>
                                )}
                            </div>
                        ))}
                    </pre>
                </div>
            )}
        </div>
    )
}
