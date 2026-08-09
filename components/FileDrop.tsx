"use client"

import { useCallback } from "react"
import { useRouter } from "next/navigation"
import { useDropzone } from "react-dropzone"
import classNames from "classnames"
import { IconFile } from "@tabler/icons-react"
import { allEntries } from "@/lib/pages"

export const FileDrop = () => {
    const router = useRouter()

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            if (!acceptedFiles.length) return

            const file = acceptedFiles[0]

            // First attempt: whatever the browser's own File API reports.
            if (file.type) {
                router.push(`/${file.type}?source=browser`)
                return
            }

            // Second attempt: match the extension against our own data.
            const extension = `.${file.name.split(".").pop()}`.toLowerCase()

            for (const mime of allEntries) {
                if (mime.fileTypes.some(t => t.toLowerCase() === extension)) {
                    router.push(`/${mime.name}?source=data`)
                    return
                }
            }

            router.push(`/unknown?source=unknown`)
        },
        [router],
    )

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
    })

    return (
        <div
            {...getRootProps()}
            className={classNames(
                "flex min-h-[200px] cursor-pointer flex-col items-center justify-center gap-4 rounded-lg border-4 border-dashed border-slate-200 bg-slate-100 p-4 py-20 text-center text-slate-600",
                { "border-slate-500 bg-slate-50": isDragActive },
            )}
        >
            <input {...getInputProps()} />
            <IconFile size={70} />
            <div className={"text-xl font-semibold"}>
                Click here to select a file and we&apos;ll tell you the
                mimetype!
            </div>
            <div className={"text-lg"}>
                Nothing will get uploaded, we&apos;re just using your browsers
                API.
            </div>
        </div>
    )
}
