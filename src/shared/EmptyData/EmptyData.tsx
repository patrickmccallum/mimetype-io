import * as React from "react"
import { IconGhost } from "@tabler/icons-react"

interface EmptyDataProps {
    text?: string
}

export const EmptyData = ({ text }: EmptyDataProps) => {
    return (
        <div className={"flex gap-2 italic text-slate-500"}>
            <IconGhost /> {text}
        </div>
    )
}
