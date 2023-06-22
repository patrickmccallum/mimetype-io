import * as React from "react"
import { IconBrandGithub, IconBrandTwitter } from "@tabler/icons-react"
import { IconButton } from "../Button/IconButton"
import { Link } from "gatsby"

export const Footer = () => {
    return (
        <footer
            className={
                "mt-4 flex items-stretch justify-between border-t border-slate-200 py-8 text-sm text-slate-400"
            }
        >
            <div className={"flex items-center"}>
                <div>
                    Made by{" "}
                    <Link
                        to={"https://twitter.com/patsnacks"}
                        className={"text-blue-500 hover:underline"}
                    >
                        @patsnacks
                    </Link>
                </div>
            </div>
            <div className={"flex items-center gap-4"}>
                <div>Licensed under MIT</div>
                <Link
                    to={"https://github.com/patrickmccallum/mimetype-io"}
                    target={"_blank"}
                >
                    <IconButton size={"sm"} title={"Visit the Github"}>
                        <IconBrandGithub />
                    </IconButton>
                </Link>
                <Link to={"https://twitter.com/patsnacks"} target={"_blank"}>
                    <IconButton size={"sm"} title={"Visit my Twitter"}>
                        <IconBrandTwitter />
                    </IconButton>
                </Link>
            </div>
        </footer>
    )
}
