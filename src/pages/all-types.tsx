import * as React from "react"
import { MainLayout } from "../shared/MainLayout/MainLayout"
import { Fit } from "../shared/Fit/Fit"
import { useData } from "../shared/DataContext/DataContext"
import { useMemo } from "react"
import { Link } from "gatsby"
import { Helmet } from "react-helmet"

const AllTypesPage = () => {
    const data = useData()
    const filtered = useMemo(() => {
        return data
            .sort((a, b) => (a.name < b.name ? -1 : 1))
            .filter(item => !item.deprecated)
    }, [data])

    return (
        <MainLayout title={"All Types"} header footer>
            <Helmet>
                <title>mimetype.io - All MIME types</title>
                <meta
                    name="description"
                    content={`All mimetypes listed in our database.`}
                />
                <meta
                    property="og:title"
                    content={`mimetype.io - All MIME types`}
                />
                <meta
                    property="og:description"
                    content={`All mimetypes listed in our database.`}
                />
                <meta property="og:type" content="website" />
                <meta
                    property="og:url"
                    content={"https://mimetype.io/all-types"}
                />
                <meta
                    property="twitter:title"
                    content={"mimetype.io - All MIME types"}
                />
                <meta
                    property="twitter:description"
                    content={
                        "Find MIME types, see related extensions, alternatives, and resources."
                    }
                />
            </Helmet>
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
                        If you wish you make modifications to add to or edit any
                        of the items below please submit a pull request on our{" "}
                        <a
                            href={
                                "https://github.com/patrickmccallum/mimetype-io"
                            }
                            className={"text-blue-500 hover:underline"}
                        >
                            GitHub
                        </a>
                        .
                    </p>
                </div>
                <div>
                    <div></div>
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
                            {filtered.map(item => (
                                <tr
                                    key={item.name}
                                    className={
                                        "flex flex-col border-b border-gray-200 pb-2 pt-2 text-gray-500 md:table-row md:pb-0  md:pt-0"
                                    }
                                >
                                    <td
                                        className={
                                            "px-4 py-1 align-top font-semibold text-gray-600 md:py-2"
                                        }
                                    >
                                        <Link
                                            to={`/${item.name}`}
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
                                        {item.types.join(", ")}
                                    </td>
                                    <td
                                        className={
                                            "flex flex-wrap gap-x-2 px-4 py-1 align-top empty:hidden md:py-2"
                                        }
                                    >
                                        {item.alternatives.map(alt => {
                                            return (
                                                <Link
                                                    to={`/${alt}`}
                                                    className={
                                                        "text-blue-500 hover:underline"
                                                    }
                                                >
                                                    {alt}
                                                </Link>
                                            )
                                        })}
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

export default AllTypesPage
