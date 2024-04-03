import * as React from "react"
import { useMemo } from "react"
import { MainLayout } from "../MainLayout/MainLayout"
import { Fit } from "../Fit/Fit"
import { DataWell, DataWellItems } from "../DataWell/DataWell"
import { SecondaryButton } from "../Button/SecondaryButton"
import {
    IconAlertTriangleFilled,
    IconBrowser,
    IconCode,
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

    const dataFileTypes: DataWellItems = useMemo(() => {
        return mime.fileTypes.map(t => ({
            label: t,
        }))
    }, [mime])

    const dataAlsoAppearsAs: DataWellItems = useMemo(() => {
        const items = []

        // General no right or wrong alternatives (e.g. heic vs heif)
        items.push(
            ...mime.links.alternativeTo.map(t => ({
                label: t,
                linkTo: `/${t}`,
                endAdornment:
                    mime.notices.popularUsage === t ? (
                        <em className={"text-slate-500"}>Popular</em>
                    ) : undefined,
            }))
        )

        // Other types where this one is "preferred"
        items.push(
            ...mime.links.parentOf.map(t => ({
                label: t,
                linkTo: `/${t}`,
                endAdornment:
                    mime.notices.popularUsage === t ? (
                        <em className={"text-slate-500"}>Popular</em>
                    ) : undefined,
            }))
        )

        // Other types where they're no longer used popularly or are "unofficial"
        items.push(
            ...mime.links.deprecates.map(t => ({
                label: t,
                linkTo: `/${t}`,
                endAdornment: <em className={"text-slate-500"}>Deprecated</em>,
            }))
        )

        // If we're an alternative, or a deprecation, show the parent and remove ourselves
        if (mime.templateData.parentType) {
            items.unshift({
                label: mime.templateData.parentType,
                linkTo: `/${mime.templateData.parentType}`,
                endAdornment: <em className={"text-slate-500"}>Preferred</em>,
            })

            items.splice(
                items.findIndex(i => i.label === mime.name),
                1
            )
        }

        return items
    }, [mime])

    return (
        <MainLayout title={`${mime.name}`} header footer>
            <Helmet>
                <title>{mime.name} - mimetype.io</title>
                <link
                    rel="canonical"
                    href={`https://mimetype.io/${mime.name}`}
                />
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
                    property={"og:image"}
                    content={"https://mimetype.io/og-image.png"}
                />
                <meta
                    property="twitter:title"
                    content={`${mime.name} - mimetype.io`}
                />
                <meta
                    property="twitter:description"
                    content={`${mime.name} - See related extensions, alternatives, and resources.`}
                />
                <meta
                    property={"twitter:card"}
                    content={"summary_large_image"}
                />
                <meta property={"twitter:site"} content={"@mimetypeio"} />
                <meta
                    property={"twitter:image"}
                    content={"https://mimetype.io/og-image.png"}
                />
            </Helmet>
            <Fit>
                <div className={"flex flex-col gap-4 py-4"}>
                    {mime.templateData.parentType && (
                        <a
                            href={`/${mime.templateData.parentType}`}
                            className={
                                "flex items-center gap-2 text-sm text-blue-500 hover:underline"
                            }
                        >
                            <IconAlertTriangleFilled /> Preferred type is{" "}
                            {mime.templateData.parentType}
                        </a>
                    )}
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
                    {mime.notices.hasNoOfficial && (
                        <div
                            className={
                                "flex items-stretch gap-3 rounded-md bg-amber-50 p-1 text-indigo-50"
                            }
                        >
                            <div
                                className={
                                    "flex w-10 items-center justify-center rounded-md bg-amber-500 p-2 text-red-50"
                                }
                            >
                                <IconCode size={20} />
                            </div>{" "}
                            <div className={"py-2 text-amber-900"}>
                                Important: An officially mentioned type either
                                does not exist, or is hard to track down. The
                                information here likely reflects community
                                contributions or popular usage derived from
                                existing implementations.
                            </div>
                        </div>
                    )}
                    {mime.notices.popularUsage && (
                        <div
                            className={
                                "flex items-stretch gap-3 rounded-md bg-amber-50 p-1 text-indigo-50"
                            }
                        >
                            <div
                                className={
                                    "flex w-10 items-center justify-center rounded-md bg-amber-500 p-2 text-red-50"
                                }
                            >
                                <IconCode size={20} />
                            </div>{" "}
                            <div className={"py-2 text-amber-900"}>
                                Important: The official type may not represent
                                community/developer consensus and you may
                                encounter issues with the official type. The{" "}
                                <strong>popular</strong> and potentially{" "}
                                <strong>more compatible</strong> type has been
                                listed as{" "}
                                <Link
                                    to={`/${mime.notices.popularUsage}`}
                                    className={"underline"}
                                >
                                    {mime.notices.popularUsage}
                                </Link>
                                .
                            </div>
                        </div>
                    )}
                    {mime.templateData.deprecatedBy && (
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
                                {mime.templateData.deprecatedBy && (
                                    <div>
                                        Instead, please use{" "}
                                        <Link
                                            to={`/${mime.templateData.deprecatedBy}`}
                                            className={"underline"}
                                        >
                                            {mime.templateData.deprecatedBy}
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
                                Your browser didn't detect this mimetype, we
                                matched it based off the file extension. No
                                upload was made.
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
                        data={dataFileTypes}
                        className={"mb-8"}
                        emptyText={
                            "Not known to appear with any file extensions"
                        }
                    />

                    <DataWell
                        title={"Also appears as"}
                        data={dataAlsoAppearsAs}
                        className={"mb-8"}
                        emptyText={"Not known to appear as any other types"}
                    />

                    <div className="flex flex-col items-start gap-4 lg:flex-row">
                        <div className={"flex flex-1 flex-col gap-4"}>
                            <h2 className={"text-md font-bold text-slate-500"}>
                                Further reading
                            </h2>
                            {mime.furtherReading.length === 0 && (
                                <EmptyData
                                    text={"No additional links listed"}
                                />
                            )}
                            <ol className={"list list-inside list-decimal"}>
                                {mime?.furtherReading?.map(({ title, url }) => (
                                    <li
                                        key={url}
                                        className={
                                            "mb-2 list-item items-center gap-2"
                                        }
                                    >
                                        <a
                                            target={"_blank"}
                                            href={url}
                                            className={
                                                "text-blue-500 hover:underline"
                                            }
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
                        <div className="flex flex-1 flex-col gap-4">
                            <h2 className={"text-md font-bold text-slate-500"}>
                                Related to
                            </h2>
                            {mime.links.relatedTo.length === 0 && (
                                <EmptyData
                                    text={"No related mimetypes listed"}
                                />
                            )}
                            <ol className={"list list-inside list-decimal"}>
                                {mime?.links.relatedTo?.map(t => (
                                    <li
                                        key={t}
                                        className={
                                            "mb-2 list-item items-center gap-2"
                                        }
                                    >
                                        <a
                                            href={`/${t}`}
                                            className={
                                                "text-blue-500 hover:underline"
                                            }
                                        >
                                            {t}
                                        </a>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>
                </div>
            </Fit>
        </MainLayout>
    )
}

MimetypeTemplate

export default MimetypeTemplate
