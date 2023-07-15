import * as React from "react"
import { MainLayout } from "../MainLayout/MainLayout"
import { Fit } from "../Fit/Fit"
import { DataWell } from "../DataWell/DataWell"
import { SecondaryButton } from "../Button/SecondaryButton"
import {
    IconBrowser,
    IconDatabase,
    IconEdit,
    IconExternalLink,
    IconHandStop,
} from "@tabler/icons-react"
import { Link } from "gatsby"
import { useParams } from "../../utils/hooks/useParams"
import { EmptyData } from "../EmptyData/EmptyData"
import { MimeData } from "../../types/mimeData"
import Helmet from "react-helmet"

const MimetypeTemplate = props => {
    const mime = props.pageContext as MimeData
    const params = useParams()

    return (
        <MainLayout title={`${mime.name}`} header footer>
            <Helmet>
                <title>{mime.name} - mimetype.io</title>
                <meta
                    name="description"
                    content={`${mime.name} - See related extensions, alternatives, and resources.`}
                />
                <meta
                    property="og:title"
                    content={`${mime.name} - mimetype.io`}
                />
                <meta
                    property="og:description"
                    content={`${mime.name} - See related extensions, alternatives, and resources.`}
                />
                <meta property="og:type" content="website" />
                <meta
                    property="og:url"
                    content={`https://mimetype.io/${mime.name}`}
                />
                <meta
                    property="twitter:title"
                    content={`${mime.name} - mimetype.io`}
                />
                <meta
                    property="twitter:description"
                    content={`${mime.name} - See related extensions, alternatives, and resources.`}
                />
            </Helmet>
            <Fit>
                <div className={"flex flex-col gap-4 py-4"}>
                    <div
                        className={
                            "flex flex-col items-start justify-between gap-8 md:flex-row md:items-center"
                        }
                    >
                        <h1
                            id={"mime-title"}
                            className={
                                "break-all text-2xl font-bold text-slate-700 md:text-4xl"
                            }
                            onClick={() => {
                                // Select the title
                                const selection = window.getSelection()
                                const range = document.createRange()
                                range.selectNodeContents(
                                    document.getElementById("mime-title")
                                )
                                selection.removeAllRanges()
                                selection.addRange(range)
                            }}
                        >
                            {mime.name}
                        </h1>
                        <div
                            className={"flex items-start gap-4 md:items-center"}
                        >
                            <a
                                href={`https://github.com/patrickmccallum/mimetype-io/issues/new?assignees=&labels=&projects=&template=mimetype-change.md&title=%5BCHANGE%5D+${encodeURIComponent(
                                    mime.name
                                )}`}
                                target={"_blank"}
                            >
                                <SecondaryButton
                                    size={"lg"}
                                    className={"whitespace-nowrap"}
                                >
                                    <IconEdit size={16} /> Edit this page
                                </SecondaryButton>
                            </a>
                        </div>
                    </div>
                    {mime.useInstead && (
                        <div
                            className={
                                "flex items-stretch gap-3 rounded-md bg-red-50 p-1 text-indigo-50"
                            }
                        >
                            <div
                                className={
                                    "flex w-10 items-center justify-center rounded-md bg-red-500 p-2 text-red-50"
                                }
                            >
                                <IconHandStop size={20} />
                            </div>{" "}
                            <div className={"py-2 text-red-900"}>
                                This mimetype is deprecated. You should still
                                support it, but avoid using it to{" "}
                                <strong>assign</strong> new mimetypes.
                                {mime.useInstead && (
                                    <div>
                                        Instead, please use{" "}
                                        <Link
                                            to={`/${mime.useInstead}`}
                                            className={"underline"}
                                        >
                                            {mime.useInstead}
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    {params.get("source") === "data" && (
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
                                We found this mimetype in our database, your
                                browser didn't recognise it.
                            </div>
                        </div>
                    )}
                    {params.get("source") === "browser" && (
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
                                Your browser detected this mimetype
                                automatically. No uploads were made.
                            </div>
                        </div>
                    )}
                    <p
                        className={"mb-8 text-base text-slate-500"}
                        dangerouslySetInnerHTML={{
                            __html: mime.description as string,
                        }}
                    />
                    <DataWell
                        title={"File types"}
                        data={mime.types}
                        className={"mb-8"}
                        emptyText={
                            "Not known to appear with any file extensions"
                        }
                    />

                    <DataWell
                        title={"Also appears as"}
                        data={
                            mime.alternatives.length !== 0
                                ? [mime.name, ...mime.alternatives]
                                : null
                        }
                        className={"mb-8"}
                        emptyText={"Not known to appear as any other types"}
                        linkItems
                    />

                    <h2 className={"text-md font-bold text-slate-500"}>
                        Further reading
                    </h2>
                    {!mime?.furtherReading && (
                        <EmptyData text={"No additional links listed"} />
                    )}
                    <ol className={"list list-inside list-decimal"}>
                        {mime?.furtherReading?.map(({ title, url }) => (
                            <li
                                key={url}
                                className={"mb-2 list-item items-center gap-2"}
                            >
                                <a
                                    target={"_blank"}
                                    href={url}
                                    className={"text-blue-500 hover:underline"}
                                >
                                    {title}
                                </a>{" "}
                                <IconExternalLink
                                    className={"text-slate-400"}
                                    size={14}
                                    style={{ display: "inline-block" }}
                                />
                            </li>
                        ))}
                    </ol>
                </div>
            </Fit>
        </MainLayout>
    )
}

MimetypeTemplate

export default MimetypeTemplate
