import Link from "next/link"
import { IconBrandGithub, IconHome2, IconPlus } from "@tabler/icons-react"
import { IconButton } from "./Button/IconButton"
import { Search } from "./Search"

export const Header = () => {
    return (
        <div
            className={
                "relative flex w-full items-stretch justify-between gap-4 py-4"
            }
        >
            <div className={"flex flex-1 items-stretch gap-2"}>
                <div className={"flex items-center text-lg tracking-wide"}>
                    <Link
                        href={"/"}
                        className={"flex items-center no-underline"}
                        aria-label={"Home"}
                    >
                        <IconButton outlined>
                            <IconHome2 />
                        </IconButton>
                    </Link>
                </div>
                <Search />
            </div>
            <div className={"flex items-center gap-2 text-slate-500"}>
                <a
                    href={"https://github.com/patrickmccallum/mimetype-io"}
                    target={"_blank"}
                    rel={"noreferrer"}
                    aria-label={"GitHub repository"}
                >
                    <IconButton outlined>
                        <IconBrandGithub />
                    </IconButton>
                </a>

                <a
                    href={
                        "https://github.com/patrickmccallum/mimetype-io/issues/new?assignees=&labels=&projects=&template=mimetype-change.md&title=%5BCHANGE%5D+mimetype%2Fhere"
                    }
                    target={"_blank"}
                    rel={"noreferrer"}
                    aria-label={"Suggest a mimetype change"}
                >
                    <IconButton outlined>
                        <IconPlus />
                    </IconButton>
                </a>
            </div>
        </div>
    )
}
