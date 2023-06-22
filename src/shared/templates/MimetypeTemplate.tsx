import * as React from "react"
import { MainLayout } from "../MainLayout/MainLayout"
import { Fit } from "../Fit/Fit"
import { DataWell } from "../ DataWell/DataWell"
import { SecondaryButton } from "../Button/SecondaryButton"
import { IconExternalLink } from "@tabler/icons-react"

const MimetypeTemplate = props => {
    const mime = props.pageContext

    return (
        <MainLayout title={`${mime.name}`} header footer>
            <Fit>
                <div className={"flex flex-col gap-4 py-4"}>
                    <div className={"flex items-center justify-between gap-4"}>
                        <h1 className={"text-4xl font-bold text-slate-700"}>
                            {mime.name}
                        </h1>
                        <div className={"flex items-center gap-4"}>
                            <SecondaryButton size={"lg"}>
                                Edit this page
                            </SecondaryButton>
                        </div>
                    </div>
                    <p
                        className={"mb-8 text-base text-slate-500"}
                        dangerouslySetInnerHTML={{
                            __html: mime.description as string,
                        }}
                    ></p>
                    <DataWell
                        title={"File types"}
                        data={mime.types}
                        className={"mb-8"}
                    />

                    <DataWell
                        title={"Also appears as"}
                        data={
                            mime?.appearsAs ?? [
                                "This type is not known to appear as anything else",
                            ]
                        }
                        className={"mb-8"}
                    />

                    <h2 className={"text-md font-bold text-slate-500"}>
                        Further reading
                    </h2>
                    <ol className={"list list-inside list-decimal"}>
                        {mime?.furtherReading?.map(({ title, url }) => (
                            <li
                                key={url}
                                className={
                                    "mb-2 flex list-item items-center gap-2"
                                }
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
