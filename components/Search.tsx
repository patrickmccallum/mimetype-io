"use client"

import * as React from "react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import classNames from "classnames"
import { IconSearch } from "@tabler/icons-react"
import Fuse, { type IFuseOptions } from "fuse.js"
import { allEntries, type MimeEntry } from "@/lib/pages"

const fuseOptions: IFuseOptions<MimeEntry> = {
    isCaseSensitive: false,
    findAllMatches: false,
    includeMatches: false,
    includeScore: false,
    useExtendedSearch: false,
    minMatchCharLength: 1,
    shouldSort: true,
    threshold: 0.6,
    location: 0,
    distance: 100,
    keys: ["name", "types", "alternatives"],
}

/**
 * Flattens a Markdown description into a single line for the results dropdown,
 * which shows a two-line clamped preview rather than rendered Markdown.
 */
const toPreviewText = (markdown: string) =>
    markdown
        .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
        .replace(/[*_`]/g, "")
        .replace(/\s+/g, " ")
        .trim()

export const Search = () => {
    const router = useRouter()
    const barRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const [isSearchFocused, setIsSearchFocused] = useState(false)
    const [searchResults, setSearchResults] = useState<MimeEntry[] | null>(null)
    const [selectedIndex, setSelectedIndex] = useState(0)

    /**
     * The index is built from the same JSON the pages are generated from. It is
     * created lazily on first use so the (fairly large) index does not cost
     * anything on pages where nobody searches.
     */
    const fuse = useMemo(() => new Fuse(allEntries, fuseOptions), [])

    const closeSearch = useCallback(() => {
        setSearchResults(null)
        setSelectedIndex(0)
        inputRef.current?.blur()
    }, [])

    const onKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Escape") {
            closeSearch()
        } else if (
            event.key === "Enter" &&
            searchResults &&
            searchResults.length > selectedIndex
        ) {
            closeSearch()
            router.push(`/${searchResults[selectedIndex].name}`)
        } else if (event.key === "ArrowDown" && searchResults?.length) {
            setSelectedIndex((selectedIndex + 1) % searchResults.length)
        } else if (event.key === "ArrowUp" && searchResults?.length) {
            setSelectedIndex(
                (selectedIndex - 1 + searchResults.length) %
                    searchResults.length,
            )
        } else {
            const query = inputRef.current?.value ?? ""
            if (query.length > 0) {
                setSelectedIndex(0)
                setSearchResults(
                    fuse
                        .search(query)
                        .map(result => result.item)
                        .slice(0, 5),
                )
            } else {
                setSearchResults(null)
            }
        }
    }

    useEffect(() => {
        const clickHandler = (event: MouseEvent) => {
            if (!barRef.current?.contains(event.target as Node)) {
                closeSearch()
            }
        }

        if (searchResults) {
            document.addEventListener("click", clickHandler)
        }

        return () => {
            document.removeEventListener("click", clickHandler)
        }
    }, [searchResults, closeSearch])

    return (
        <div
            ref={barRef}
            className={classNames(
                "absolute top-4 right-0 bottom-4 left-0 flex w-full max-w-sm flex-1 cursor-text items-center gap-2 rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 transition-colors duration-100 md:relative md:top-0 md:right-0 md:bottom-0 md:left-0",
                { "!bg-white": isSearchFocused },
            )}
            onClick={() => {
                inputRef.current?.select()
            }}
        >
            <IconSearch className={"text-slate-500"} size={20} />
            <input
                ref={inputRef}
                type={"text"}
                className={
                    "placeholder:slate-500 slate-800 flex-1 bg-transparent text-sm focus:text-slate-800 focus:outline-0"
                }
                placeholder={"Search mimetypes"}
                aria-label={"Search mimetypes"}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                onKeyUp={onKeyUp}
            />
            {searchResults && (
                <div
                    className={
                        "absolute top-[100%] right-0 left-0 z-10 translate-y-2 rounded-md bg-white shadow-lg"
                    }
                >
                    {searchResults.map((result, index) => (
                        <div
                            key={result.name}
                            className={classNames(
                                "flex cursor-pointer flex-col gap-2 px-6 py-3 text-gray-700 transition-all duration-100",
                                {
                                    "border-l-4 border-blue-500 bg-blue-50":
                                        index === selectedIndex,
                                },
                            )}
                            onClick={() => {
                                router.push(`/${result.name}`)
                                closeSearch()
                            }}
                        >
                            <div className={"text-sm font-semibold"}>
                                {result.name}
                            </div>
                            {result.description && (
                                <div
                                    className={
                                        "line-clamp-2 overflow-hidden text-xs leading-5 text-ellipsis text-gray-500"
                                    }
                                >
                                    {toPreviewText(result.description)}
                                </div>
                            )}
                            <div className={"flex flex-wrap gap-2"}>
                                {result.fileTypes.map(type => {
                                    const matchesSearch = (
                                        inputRef.current?.value ?? ""
                                    ).includes(type.substring(1))

                                    return (
                                        <div
                                            key={type}
                                            className={classNames(
                                                "text-xs text-gray-400",
                                                {
                                                    "font-bold text-amber-500":
                                                        matchesSearch,
                                                },
                                            )}
                                        >
                                            {type}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
