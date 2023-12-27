import * as React from "react"
import { IconFile } from "@tabler/icons-react"
import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import * as classNames from "classnames"
import { navigate } from "gatsby"
import { useData } from "../DataContext/DataContext"

export const FileDrop = () => {
    const mimeData = useData()

    const onDrop = useCallback(acceptedFiles => {
        // Do something with the files
        console.info("Got files", acceptedFiles)

        // First attempt from browser API
        const browsersType = acceptedFiles[0].type

        if (browsersType) {
            navigate(`/${acceptedFiles[0].type}?source=browser`)
            return
        }

        // Second attempt from file extension
        const extension = `.${acceptedFiles[0].name.split(".").pop()}`

        if (extension) {
            console.info(`Trying to find ${extension} in`, mimeData)
            for (const mime of mimeData) {
                if (mime.fileTypes.includes(extension)) {
                    navigate(`/${mime.name}?source=data`)
                    return
                }
            }
        }

        // Fail to unknown
        navigate(`/unknown?source=unknown`)
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
    })

    return (
        <div
            {...getRootProps()}
            className={classNames(
                "flex min-h-[200px] cursor-pointer flex-col items-center justify-center gap-4 rounded-lg border-4 border-dashed border-slate-200 bg-slate-100 p-4 py-20 text-center text-slate-600",
                {
                    "border-slate-500 bg-slate-50": isDragActive,
                }
            )}
        >
            <input {...getInputProps()} />
            <IconFile size={70} />
            <div className={"text-xl font-semibold"}>
                Click here to select a file and we'll tell you the mimetype!
            </div>
            <div className={"text-lg"}>
                Nothing will get uploaded, we're just using your browsers API.
            </div>
        </div>
    )
}
