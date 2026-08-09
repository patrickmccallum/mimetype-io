"use client"

import { useSearchParams } from "next/navigation"
import { IconBrowser, IconDatabase } from "@tabler/icons-react"

/**
 * Explains how the visitor arrived when they came from the file dropzone.
 *
 * Reads the `source` query parameter, so it must be a client component and must
 * sit inside a Suspense boundary — under static export the shell is prerendered
 * without query parameters and this fills in once hydrated.
 */
export const SourceNotice = () => {
    const source = useSearchParams().get("source")

    if (source === "data") {
        return (
            <div
                className={
                    "flex items-center gap-3 rounded-md bg-indigo-50 p-1 text-indigo-50"
                }
            >
                <div
                    className={
                        "text-indigo-5 flex w-10 items-center justify-center rounded-md bg-blue-500 p-2"
                    }
                >
                    <IconDatabase size={20} />
                </div>{" "}
                <div className={"text-indigo-900"}>
                    Your browser didn&apos;t detect this mimetype, we matched it
                    based off the file extension. No upload was made.
                </div>
            </div>
        )
    }

    if (source === "browser") {
        return (
            <div
                className={
                    "flex items-center gap-3 rounded-md bg-indigo-50 p-1 text-indigo-50"
                }
            >
                <div
                    className={
                        "flex w-10 items-center justify-center rounded-md bg-indigo-500 p-2 text-indigo-50"
                    }
                >
                    <IconBrowser size={20} />
                </div>{" "}
                <div className={"text-indigo-900"}>
                    Your browser detected this mimetype automatically. No
                    uploads were made.
                </div>
            </div>
        )
    }

    return null
}
