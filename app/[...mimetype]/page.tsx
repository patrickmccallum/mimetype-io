import { Suspense } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
    IconAlertTriangleFilled,
    IconCode,
    IconEdit,
    IconExternalLink,
    IconHandStop,
} from "@tabler/icons-react"
import { MainLayout } from "@/components/MainLayout"
import { Fit } from "@/components/Fit"
import { DataWell, type DataWellItems } from "@/components/DataWell"
import { EmptyData } from "@/components/EmptyData"
import { SecondaryButton } from "@/components/Button/SecondaryButton"
import { MimeTitle } from "@/components/MimeTitle"
import { SourceNotice } from "@/components/SourceNotice"
import { allMimePaths, getMimePage, SITE_URL, OG_IMAGE } from "@/lib/pages"

// Every page is known at build time; anything else is a genuine 404.
export const dynamicParams = false

type Params = { mimetype: string[] }

export function generateStaticParams(): Params[] {
    return allMimePaths.map(path => ({ mimetype: path.split("/") }))
}

function pathFrom(params: Params) {
    return params.mimetype.join("/")
}

export async function generateMetadata({
    params,
}: {
    params: Promise<Params>
}): Promise<Metadata> {
    const mime = getMimePage(pathFrom(await params))

    if (!mime) return {}

    // Use the resolved entry's name rather than the raw route param, so a
    // segment that arrived with its `+` mangled still produces the correct
    // canonical URL and title.
    const name = mime.name
    const title = `${name} - mimetype.io`
    const description = `${name} - See related extensions, alternatives, and resources.`
    const url = `${SITE_URL}/${name}`

    return {
        title,
        description,
        alternates: { canonical: url },
        openGraph: {
            title,
            description,
            type: "website",
            url,
            images: [OG_IMAGE],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            site: "@mimetypeio",
            images: [OG_IMAGE],
        },
    }
}

export default async function MimetypePage({
    params,
}: {
    params: Promise<Params>
}) {
    const mime = getMimePage(pathFrom(await params))

    if (!mime) notFound()

    const dataFileTypes: DataWellItems = mime.fileTypes.map(t => ({ label: t }))

    const dataAlsoAppearsAs: DataWellItems = []

    // General, no right or wrong alternatives (e.g. heic vs heif)
    for (const t of mime.links.alternativeTo) {
        dataAlsoAppearsAs.push({
            label: t,
            linkTo: `/${t}`,
            endAdornment:
                mime.notices.popularUsage === t ? (
                    <em className={"text-slate-500"}>Popular</em>
                ) : undefined,
        })
    }

    // Other types where this one is "preferred"
    for (const t of mime.links.parentOf) {
        dataAlsoAppearsAs.push({
            label: t,
            linkTo: `/${t}`,
            endAdornment:
                mime.notices.popularUsage === t ? (
                    <em className={"text-slate-500"}>Popular</em>
                ) : undefined,
        })
    }

    // Types no longer popularly used, or unofficial
    for (const t of mime.links.deprecates) {
        dataAlsoAppearsAs.push({
            label: t,
            linkTo: `/${t}`,
            endAdornment: <em className={"text-slate-500"}>Deprecated</em>,
        })
    }

    // If this page is itself an alternative or a deprecation, surface the
    // preferred type and drop the self-reference.
    if (mime.templateData.parentType) {
        dataAlsoAppearsAs.unshift({
            label: mime.templateData.parentType,
            linkTo: `/${mime.templateData.parentType}`,
            endAdornment: <em className={"text-slate-500"}>Preferred</em>,
        })

        const self = dataAlsoAppearsAs.findIndex(i => i.label === mime.name)
        if (self !== -1) dataAlsoAppearsAs.splice(self, 1)
    }

    const editUrl = `https://github.com/patrickmccallum/mimetype-io/issues/new?assignees=&labels=&projects=&template=mimetype-change.md&title=%5BCHANGE%5D+${encodeURIComponent(
        mime.name,
    )}`

    return (
        <MainLayout header footer>
            <Fit>
                <div className={"flex flex-col gap-4 py-4"}>
                    {mime.templateData.parentType && (
                        <Link
                            href={`/${mime.templateData.parentType}`}
                            className={
                                "flex items-center gap-2 text-sm text-blue-500 hover:underline"
                            }
                        >
                            <IconAlertTriangleFilled /> Preferred type is{" "}
                            {mime.templateData.parentType}
                        </Link>
                    )}
                    <div
                        className={
                            "flex flex-col items-start justify-between gap-8 md:flex-row md:items-center"
                        }
                    >
                        <MimeTitle name={mime.name} />
                        <div
                            className={"flex items-start gap-4 md:items-center"}
                        >
                            <a
                                href={editUrl}
                                target={"_blank"}
                                rel={"noreferrer"}
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
                            {mime.name === mime.notices.popularUsage &&
                                mime.notices.hasNoOfficial && (
                                    <div className={"py-2 text-amber-900"}>
                                        Important: There is no officially listed
                                        type for this entry. The{" "}
                                        <strong>popular</strong> and potentially{" "}
                                        <strong>most compatible</strong> type
                                        has been listed as{" "}
                                        <Link
                                            href={`/${mime.notices.popularUsage}`}
                                            className={"underline"}
                                        >
                                            {mime.notices.popularUsage}
                                        </Link>
                                        .
                                    </div>
                                )}
                            {mime.name !== mime.notices.popularUsage &&
                                mime.notices.hasNoOfficial && (
                                    <div className={"py-2 text-amber-900"}>
                                        Important: The official type may not
                                        represent community/developer consensus
                                        and you may encounter issues with the
                                        official type. The{" "}
                                        <strong>popular</strong> and potentially{" "}
                                        <strong>more compatible</strong> type
                                        has been listed as{" "}
                                        <Link
                                            href={`/${mime.notices.popularUsage}`}
                                            className={"underline"}
                                        >
                                            {mime.notices.popularUsage}
                                        </Link>
                                        .
                                    </div>
                                )}
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
                                <div>
                                    Instead, please use{" "}
                                    <Link
                                        href={`/${mime.templateData.deprecatedBy}`}
                                        className={"underline"}
                                    >
                                        {mime.templateData.deprecatedBy}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}

                    <Suspense fallback={null}>
                        <SourceNotice />
                    </Suspense>

                    <p
                        className={"mb-8 text-base text-slate-500"}
                        dangerouslySetInnerHTML={{
                            __html: mime.description ?? "",
                        }}
                    />

                    <DataWell
                        title={"File types"}
                        data={dataFileTypes}
                        className={"mb-8"}
                        currentPath={`/${mime.name}`}
                        emptyText={
                            "Not known to appear with any file extensions"
                        }
                    />

                    <DataWell
                        title={"Also appears as"}
                        data={dataAlsoAppearsAs}
                        className={"mb-8"}
                        currentPath={`/${mime.name}`}
                        emptyText={"Not known to appear as any other types"}
                    />

                    <div className="flex flex-col items-start gap-4 lg:flex-row">
                        <div className={"flex flex-1 flex-col gap-4"}>
                            <h2 className={"text-md font-bold text-slate-500"}>
                                Further reading
                            </h2>
                            {(mime.furtherReading?.length ?? 0) === 0 && (
                                <EmptyData
                                    text={"No additional links listed"}
                                />
                            )}
                            <ol className={"list list-inside list-decimal"}>
                                {mime.furtherReading?.map(({ title, url }) => (
                                    <li
                                        key={url}
                                        className={
                                            "mb-2 list-item items-center gap-2"
                                        }
                                    >
                                        <a
                                            target={"_blank"}
                                            rel={"noreferrer"}
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
                                {mime.links.relatedTo.map(t => (
                                    <li
                                        key={t}
                                        className={
                                            "mb-2 list-item items-center gap-2"
                                        }
                                    >
                                        <Link
                                            href={`/${t}`}
                                            className={
                                                "text-blue-500 hover:underline"
                                            }
                                        >
                                            {t}
                                        </Link>
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
