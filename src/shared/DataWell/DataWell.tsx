import * as React from "react"
import { useMemo } from "react"
import * as classNames from "classnames"
import { CopyButton } from "../Button/CopyButton"
import { EmptyData } from "../EmptyData/EmptyData"
import { Link } from "gatsby"

import { globalHistory } from "@reach/router"

const path = globalHistory.location.pathname

export type DataWellItem = {
    label: string
    linkTo?: string
    endAdornment?: JSX.Element | string
}

export type DataWellItems = Array<DataWellItem>

interface DataWellProps {
    title?: string
    data: DataWellItems
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
    const content = useMemo(() => {
        return data
            .sort((a, b) => (a.label < b.label ? -1 : 1))
            .map((item, index) => (
                <div key={index} className={"flex items-baseline gap-2"}>
                    {item.linkTo ? (
                        <Link
                            to={item.linkTo}
                            className={
                                !path.includes(item.linkTo) ? "underline" : ""
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
            ))
    }, [data])

    const jsonData = useMemo(() => {
        return data.map(item => item.label)
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
                            data={JSON.stringify(jsonData, null, 4)}
                            label={"Copy as JSON"}
                        />
                        <CopyButton
                            data={jsonData.map(item => item).join("\n")}
                            label={"Copy as is"}
                        />
                    </div>
                )}
            </div>
            {data.length === 0 && <EmptyData text={emptyText} />}
            {data.length !== 0 && (
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
                        {content}
                    </pre>
                </div>
            )}
        </div>
    )
}
