"use client"

/**
 * The page heading, which selects its own text when clicked so the type can be
 * copied in one gesture. That is the only reason this is a client component;
 * the text itself is rendered on the server and present in the HTML.
 */
export const MimeTitle = ({ name }: { name: string }) => {
    return (
        <h1
            id={"mime-title"}
            className={
                "text-2xl font-bold break-all text-slate-700 md:text-4xl"
            }
            onClick={() => {
                const element = document.getElementById("mime-title")
                const selection = window.getSelection()
                if (!element || !selection) return

                const range = document.createRange()
                range.selectNodeContents(element)
                selection.removeAllRanges()
                selection.addRange(range)
            }}
        >
            {name}
        </h1>
    )
}
