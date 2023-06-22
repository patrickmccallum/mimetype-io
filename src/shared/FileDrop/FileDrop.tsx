import * as React from "react"
import { IconFile } from "@tabler/icons-react"
import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import * as classNames from "classnames"
import { navigate } from "gatsby"

export const FileDrop = () => {
    const onDrop = useCallback(acceptedFiles => {
        // Do something with the files
        console.info("Got files", acceptedFiles)

        navigate(acceptedFiles[0].type)
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
    })

    return (
        <div
            {...getRootProps()}
            className={classNames(
                "flex min-h-[200px] cursor-pointer flex-col items-center justify-center gap-4 rounded-lg border-4 border-dashed border-slate-200 bg-slate-100 p-4 py-20 text-slate-600",
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
