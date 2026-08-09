import Link from "next/link"
import Markdown from "markdown-to-jsx"

/**
 * Renders a mimetype description.
 *
 * Descriptions are Markdown and are rendered to React elements on the server —
 * there is no `dangerouslySetInnerHTML` anywhere in the render path, which is
 * what closes issue #4.
 *
 * `disableParsingRawHTML` is the important flag: without it, Markdown would
 * still pass embedded HTML straight through and the injection sink would simply
 * have moved rather than gone. With it, a description containing `<script>`
 * renders as literal text.
 *
 * Descriptions arrive from src/mimeData.json via pull request, so the threat
 * model is a malicious contribution slipping past review of a very large diff,
 * not runtime user input.
 */
export const Description = ({ markdown }: { markdown: string }) => {
    if (!markdown?.trim()) return null

    return (
        <div className={"mb-8 text-base text-slate-500"}>
            <Markdown
                options={{
                    disableParsingRawHTML: true,
                    forceBlock: true,
                    overrides: {
                        // Spacing lives on the paragraph rather than the
                        // container: markdown-to-jsx inserts its own wrapper
                        // element, so a flex gap on the outer div would only
                        // ever see one child.
                        p: {
                            props: {
                                className: "mb-4 text-base text-slate-500",
                            },
                        },
                        a: { component: DescriptionLink },
                        code: {
                            props: {
                                className:
                                    "rounded bg-slate-100 px-1 py-0.5 text-sm text-slate-700",
                            },
                        },
                        strong: { props: { className: "font-semibold" } },
                        ul: {
                            props: { className: "mb-4 list-inside list-disc" },
                        },
                        ol: {
                            props: {
                                className: "mb-4 list-inside list-decimal",
                            },
                        },
                    },
                }}
            >
                {markdown}
            </Markdown>
        </div>
    )
}

/**
 * Internal cross-references navigate client-side via next/link, matching every
 * other internal link on the site. External links open in a new tab and always
 * carry rel="noreferrer" — the one external link in the corpus previously had
 * target="_blank" without it, which is a reverse-tabnabbing hole.
 *
 * Do not spread the remaining props onto the element. markdown-to-jsx passes a
 * `className` of its own, so a trailing `{...rest}` lands after this one and
 * silently overwrites it, emitting an unstyled anchor with no error or warning.
 */
const DescriptionLink = ({
    href = "",
    children,
}: {
    href?: string
    children?: React.ReactNode
}) => {
    const className = "text-blue-500 underline hover:no-underline"

    if (href.startsWith("/")) {
        return (
            <Link href={href} className={className}>
                {children}
            </Link>
        )
    }

    return (
        <a
            href={href}
            target={"_blank"}
            rel={"noreferrer"}
            className={className}
        >
            {children}
        </a>
    )
}
