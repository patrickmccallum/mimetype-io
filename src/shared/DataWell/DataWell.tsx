import * as React from "react"
import { useMemo } from "react"
import * as classNames from "classnames"
import { CopyButton } from "../Button/CopyButton"
import { IconGhost } from "@tabler/icons-react"
import { EmptyData } from "../EmptyData/EmptyData"
import { Link } from "gatsby"

interface DataWellProps {
    title?: string
    data: Array<string> | unknown
    className?: string
    emptyText?: string
    linkItems?: boolean
}

export const DataWell = ({
    data,
    className,
    title,
    linkItems,
    emptyText = "No data provided",
}: DataWellProps) => {
    const path = window.location.pathname

    const content = useMemo(() => {
        if (Array.isArray(data)) {
            return data.sort().join("\n")
        }

        return JSON.stringify(data, null, 4)
    }, [data])

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

                {data && (
                    <div
                        className={
                            "flex items-center gap-2 rounded-lg bg-slate-50"
                        }
                    >
                        <CopyButton
                            data={JSON.stringify(data, null, 1)}
                            label={"Copy as JSON"}
                        />
                        <CopyButton
                            data={
                                Array.isArray(data)
                                    ? data.join(", ")
                                    : (data as string)
                            }
                            label={"Copy as is"}
                        />
                    </div>
                )}
            </div>
            {!data && <EmptyData text={emptyText} />}
            {data && (
                <div
                    className={classNames(
                        "relative flex flex-col overflow-hidden rounded-md bg-slate-200 md:flex-row",
                        className
                    )}
                >
                    <pre
                        className={
                            "flex-1 whitespace-break-spaces p-4 text-sm leading-loose"
                        }
                    >
                        {!linkItems ? (
                            content
                        ) : (
                            <div>
                                {Array.isArray(data) &&
                                    data.map((item, index) => (
                                        <div key={index}>
                                            <Link
                                                to={`/${item}`}
                                                className={
                                                    !path.includes(item)
                                                        ? "underline"
                                                        : ""
                                                }
                                            >
                                                {item}
                                            </Link>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </pre>
                </div>
            )}
        </div>
    )
}
