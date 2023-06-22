import * as React from "react"
import { useRef, useState } from "react"
import { Link } from "gatsby"
import {
    IconArrowDown,
    IconArrowLeft,
    IconBrandGithub,
    IconCode,
    IconPlus,
    IconSearch,
    IconSlash,
} from "@tabler/icons-react"
import * as classNames from "classnames"
import { IconButton } from "../Button/IconButton"

interface HeaderProps {}

export const Header = ({}: HeaderProps) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const [isSearchFocused, setIsSearchFocused] = useState(false)

    return (
        <div className={"flex w-full items-stretch justify-between gap-4 py-4"}>
            <div className={"flex flex-1 items-stretch gap-4"}>
                <div className={"flex items-center text-lg tracking-wide"}>
                    {/*<Link to={"/"} className={"flex items-center no-underline"}>*/}
                    {/*    <div*/}
                    {/*        className={*/}
                    {/*            "rounded-full bg-slate-500 p-2 font-bold text-slate-50 underline-offset-4 hover:underline"*/}
                    {/*        }*/}
                    {/*    >*/}
                    {/*        <IconCode />*/}
                    {/*    </div>*/}
                    {/*</Link>*/}
                    <IconButton>
                        <IconArrowLeft />
                    </IconButton>
                </div>
                <div className={"flex items-center"}>
                    <div
                        className={
                            "flex items-center gap-1 border border-slate-300 px-2 py-1"
                        }
                    >
                        <div>image</div>/<div>heic</div>
                    </div>
                </div>
            </div>
            <div className={"flex items-center gap-2 text-slate-500"}>
                <div
                    className={classNames(
                        "flex w-full max-w-sm flex-1 cursor-text items-center gap-4 rounded-lg bg-slate-200 px-6 py-3 transition-all duration-100",
                        {
                            "bg-white shadow-sm shadow-slate-400 ring-slate-500":
                                isSearchFocused,
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
                        className={
                            "placeholder:slate-500 slate-800 flex-1 bg-transparent text-sm focus:text-slate-800 focus:outline-0"
                        }
                        placeholder={"Search mimetypes"}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setIsSearchFocused(false)}
                    />
                </div>
                <IconButton>
                    <IconBrandGithub />
                </IconButton>
                <IconButton>
                    <IconPlus />
                </IconButton>
            </div>
        </div>
    )
}
