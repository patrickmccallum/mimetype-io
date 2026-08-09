import { IconGhost } from "@tabler/icons-react"

interface EmptyDataProps {
    text?: string
}

export const EmptyData = ({ text }: EmptyDataProps) => {
    return (
        <div className={"flex gap-2 text-slate-500 italic"}>
            <IconGhost /> {text}
        </div>
    )
}
