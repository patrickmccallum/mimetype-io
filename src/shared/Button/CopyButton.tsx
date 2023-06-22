import * as React from "react"
import { SecondaryButton } from "./SecondaryButton"
import { useState } from "react"
import { IconCheck, IconClipboardCopy } from "@tabler/icons-react"

interface CopyButtonProps {
    data: string
    label: string
    size?: "sm" | "md" | "lg"
}

export const CopyButton = ({ data, label, size = "md" }: CopyButtonProps) => {
    const [isCopied, setCopied] = useState(false)

    return (
        <SecondaryButton
            size={size}
            className={"flex items-center gap-2"}
            onClick={() => {
                navigator.clipboard.writeText(data)
                setCopied(true)
                setTimeout(() => setCopied(false), 2_500)
            }}
        >
            {isCopied ? (
                <>
                    <IconCheck size={14} /> <span>Copied!</span>
                </>
            ) : (
                <>
                    <IconClipboardCopy size={14} /> <span>{label}</span>
                </>
            )}
        </SecondaryButton>
    )
}
