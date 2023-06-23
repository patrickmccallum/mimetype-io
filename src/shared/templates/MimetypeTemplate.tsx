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
    IconFocusAuto,
} from "@tabler/icons-react"
import { Link } from "gatsby"
import { useParams } from "../../utils/hooks/useParams"
import { EmptyData } from "../EmptyData/EmptyData"
import { CopyButton } from "../Button/CopyButton"

const MimetypeTemplate = props => {
    const mime = props.pageContext
    const params = useParams()

    return (
        <MainLayout title={`${mime.name}`} header footer>
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
                                href={
                                    "https://github.com/patrickmccallum/mimetype-io/blob/master/mimeData.json"
                                }
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
                    {params.get("source") === "data" && (
                        <div
                            className={"flex items-center gap-3 text-indigo-50"}
                        >
                            <IconDatabase
                                size={40}
                                className={
                                    "rounded-md bg-blue-500 p-2 text-indigo-50"
                                }
                            />{" "}
                            <div className={"italic text-slate-600"}>
                                We found this mimetype in our database, your
                                browser didn't recognise it.
                            </div>
                        </div>
                    )}
                    {params.get("source") === "browser" && (
                        <div
                            className={"flex items-center gap-3 text-indigo-50"}
                        >
                            <IconBrowser
                                size={40}
                                className={
                                    "rounded-md bg-indigo-500 p-2 text-indigo-50"
                                }
                            />{" "}
                            <div className={"italic text-slate-600"}>
                                Your browser detected this mimetype
                                automatically.
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
                        data={mime?.appearsAs}
                        className={"mb-8"}
                        emptyText={"Not known to appear as any other types"}
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

export default MimetypeTemplate
