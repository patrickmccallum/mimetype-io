import * as React from "react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import * as classNames from "classnames"
import { IconSearch } from "@tabler/icons-react"
import Fuse from "fuse.js"
import { MimeData } from "../../types/mimeData"
import { useData } from "../DataContext/DataContext"
import { navigate } from "gatsby"
import IFuseOptions = Fuse.IFuseOptions

const fuseOptions: IFuseOptions<MimeData> = {
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

interface SearchProps {}

export const Search = ({}: SearchProps) => {
    const barRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const data = useData()

    const [isSearchFocused, setIsSearchFocused] = useState(false)
    const [searchResults, setSearchResults] = useState<MimeData[] | null>(null)
    const [selectedIndex, setSelectedIndex] = useState(0)

    const fuse = useMemo(() => {
        return new Fuse(data, fuseOptions)
    }, [])

    const closeSearch = useCallback(() => {
        setSearchResults(null)
        setSelectedIndex(0)
        inputRef.current.blur()
    }, [])

    const onKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Escape") {
            closeSearch()
        } else if (
            event.key === "Enter" &&
            searchResults.length > selectedIndex
        ) {
            closeSearch()
            navigate(`/${searchResults[selectedIndex].name}`)
        } else if (event.key === "ArrowDown") {
            setSelectedIndex((selectedIndex + 1) % searchResults.length)
        } else if (event.key === "ArrowUp") {
            setSelectedIndex(
                (selectedIndex - 1 + searchResults.length) %
                    searchResults.length
            )
        } else {
            const query = inputRef.current.value
            if (query.length > 0) {
                setSelectedIndex(0)
                setSearchResults(
                    fuse
                        .search(query)
                        .map(result => result.item)
                        .filter(m => !m.deprecated)
                        .slice(0, 5)
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
    }, [searchResults])

    return (
        <div
            ref={barRef}
            className={classNames(
                "absolute bottom-4 left-0 right-0 top-4 flex w-full max-w-sm flex-1 cursor-text items-center gap-2 rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 transition-colors duration-100 md:relative md:bottom-0 md:left-0 md:right-0 md:top-0",
                {
                    "!bg-white ": isSearchFocused,
                }
            )}
            onClick={() => {
                inputRef.current?.select()
            }}
        >
            <IconSearch className={"text-slate-500"} size={20} />
            <input
                ref={inputRef}
                type={"text"}
                className={classNames(
                    "placeholder:slate-500 slate-800 flex-1 bg-transparent text-sm focus:text-slate-800 focus:outline-0"
                )}
                placeholder={"Search mimetypes"}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                onKeyUp={onKeyUp}
            />
            {searchResults && (
                <div
                    className={
                        "absolute left-0 right-0 top-[100%] z-10 translate-y-2 rounded-md bg-white shadow-lg"
                    }
                >
                    {searchResults.map((result, index) => {
                        return (
                            <div
                                key={result.name}
                                className={classNames(
                                    "flex cursor-pointer flex-col gap-2 px-6 py-3 text-gray-700 transition-all duration-100",
                                    {
                                        "border-l-4 border-blue-500 bg-blue-50":
                                            index === selectedIndex,
                                    }
                                )}
                                onClick={() => {
                                    navigate(`/${result.name}`)
                                    closeSearch()
                                }}
                            >
                                <div className={"text-sm font-semibold"}>
                                    {result.name}
                                </div>
                                {result.description && (
                                    <div
                                        className={
                                            "line-clamp-2 overflow-hidden text-ellipsis text-xs leading-5 text-gray-500"
                                        }
                                    >
                                        {result.description}
                                    </div>
                                )}
                                <div className={"flex flex-wrap gap-2"}>
                                    {result.types.map(type => {
                                        const matchesSearch =
                                            inputRef.current.value.includes(
                                                type.substring(1)
                                            )

                                        return (
                                            <div
                                                key={type}
                                                className={classNames(
                                                    "text-xs text-gray-400",
                                                    {
                                                        "font-bold text-amber-500":
                                                            matchesSearch,
                                                    }
                                                )}
                                            >
                                                {type}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
