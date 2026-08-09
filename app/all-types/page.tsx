import type { Metadata } from "next"
import Link from "next/link"
import { IconBrandGithub } from "@tabler/icons-react"
import { MainLayout } from "@/components/MainLayout"
import { Fit } from "@/components/Fit"
import { allEntries, SITE_URL, OG_IMAGE } from "@/lib/pages"

const title = "mimetype.io - All MIME types"
const description = "All mimetypes listed in our database."

export const metadata: Metadata = {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/all-types` },
    openGraph: {
        title,
        description,
        type: "website",
        url: `${SITE_URL}/all-types`,
        images: [OG_IMAGE],
    },
    twitter: {
        card: "summary_large_image",
        title,
        description:
            "Find MIME types, see related extensions, alternatives, and resources.",
        images: [OG_IMAGE],
    },
}

export default function AllTypesPage() {
    const sorted = [...allEntries].sort((a, b) => (a.name < b.name ? -1 : 1))

    return (
        <MainLayout header footer>
            <Fit>
                <div className={"flex flex-col py-4 text-gray-700"}>
                    <h1 className={"mb-2 text-4xl text-gray-800"}>
                        All MIME types
                    </h1>
                    <p className={"text-base"}>
                        Below is a comprehensive list of all MIME types in our
                        database.
                    </p>
                    <p>
                        If you&apos;d like to make modifications to add or edit
                        any of the items below please submit a pull request on
                        our{" "}
                        <a
                            href={
                                "https://github.com/patrickmccallum/mimetype-io"
                            }
                            className={"text-blue-500 hover:underline"}
                            target={"_blank"}
                            rel={"noreferrer"}
                        >
                            <IconBrandGithub className={"inline"} /> GitHub
                        </a>
                        .
                    </p>
                </div>
                <div>
                    <table className={"w-full table-auto text-gray-500"}>
                        <thead>
                            <tr
                                className={
                                    "hidden bg-white text-left font-semibold text-gray-600 md:table-row"
                                }
                            >
                                <th
                                    className={
                                        "sticky top-0 z-10 border-b border-gray-200 bg-white px-4 py-3"
                                    }
                                    scope={"col"}
                                >
                                    MIME
                                </th>
                                <th
                                    className={
                                        "sticky top-0 z-10 border-b border-gray-200 bg-white px-4 py-3"
                                    }
                                    scope={"col"}
                                >
                                    File types
                                </th>
                                <th
                                    className={
                                        "sticky top-0 z-10 border-b border-gray-200 bg-white px-4 py-3"
                                    }
                                    scope={"col"}
                                >
                                    AKA
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {sorted.map(item => (
                                <tr
                                    key={item.name}
                                    className={
                                        "flex flex-col border-b border-gray-200 pt-2 pb-2 text-gray-500 md:table-row md:pt-0 md:pb-0"
                                    }
                                >
                                    <td
                                        className={
                                            "px-4 py-1 align-top font-semibold text-gray-600 md:py-2"
                                        }
                                    >
                                        <Link
                                            href={`/${item.name}`}
                                            className={"hover:underline"}
                                        >
                                            {item.name}
                                        </Link>
                                    </td>
                                    <td
                                        className={
                                            "px-4 py-1 align-top md:py-2"
                                        }
                                    >
                                        {item.fileTypes.join(", ")}
                                    </td>
                                    <td
                                        className={
                                            "flex flex-wrap gap-x-2 px-4 py-1 align-top empty:hidden md:py-2"
                                        }
                                    >
                                        {item.links.parentOf.map(alt => (
                                            <Link
                                                key={alt}
                                                href={`/${alt}`}
                                                className={
                                                    "text-blue-500 hover:underline"
                                                }
                                            >
                                                {alt}
                                            </Link>
                                        ))}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Fit>
        </MainLayout>
    )
}
