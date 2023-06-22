import * as React from "react"
import { useMemo } from "react"
import * as classNames from "classnames"
import { SecondaryButton } from "../Button/SecondaryButton"
import { CopyButton } from "../Button/CopyButton"

interface DataWellProps {
    title?: string
    data: Array<string> | unknown
    className?: string
}

export const DataWell = ({ data, className, title }: DataWellProps) => {
    const content = useMemo(() => {
        if (Array.isArray(data)) {
            return data.sort().join("\n")
        }

        return JSON.stringify(data, null, 4)
    }, [data])

    return (
        <div className={"flex flex-col gap-4 "}>
            <div className={"flex items-center justify-between gap-4"}>
                <div>
                    {title && (
                        <h2 className={"text-md font-bold text-slate-500"}>
                            {title}
                        </h2>
                    )}
                </div>
                <div
                    className={"flex items-center gap-2 rounded-lg bg-slate-50"}
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
            </div>
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
                <div className={"flex items-start border-slate-300 p-2"}></div>
            </div>
        </div>
    )
}
