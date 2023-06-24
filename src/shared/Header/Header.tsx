import * as React from "react"
import { Link } from "gatsby"
import { IconBrandGithub, IconHome, IconPlus } from "@tabler/icons-react"
import { IconButton } from "../Button/IconButton"
import { Search } from "../Search/Search"

interface HeaderProps {}

export const Header = ({}: HeaderProps) => {
    return (
        <div
            className={
                "relative flex w-full items-stretch justify-between gap-4 py-4"
            }
        >
            <div className={"flex flex-1 items-stretch gap-4"}>
                <div className={"flex items-center text-lg tracking-wide"}>
                    <Link to={"/"} className={"flex items-center no-underline"}>
                        <div
                            className={
                                "rounded-full bg-slate-500 p-2 font-bold text-slate-50 underline-offset-4 hover:underline"
                            }
                        >
                            <IconHome />
                        </div>
                    </Link>
                </div>
                <Search />
            </div>
            <div className={"flex items-center gap-2 text-slate-500"}>
                <a
                    href={"https://github.com/patrickmccallum/mimetype-io"}
                    target={"_blank"}
                >
                    <IconButton>
                        <IconBrandGithub />
                    </IconButton>
                </a>

                <a
                    href={
                        "https://github.com/patrickmccallum/mimetype-io/issues/new?assignees=&labels=&projects=&template=mimetype-change.md&title=%5BCHANGE%5D+mimetype%2Fhere"
                    }
                    target={"_blank"}
                >
                    <IconButton>
                        <IconPlus />
                    </IconButton>
                </a>
            </div>
        </div>
    )
}
