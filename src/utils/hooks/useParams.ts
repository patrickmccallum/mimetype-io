import { useMemo, useState } from "react"

export const useParams = () => {
    const [params, setParams] = useState<URLSearchParams>(new URLSearchParams())

    useMemo(() => {
        const params = new URLSearchParams(
            typeof window === "undefined" ? {} : document.location.search
        )

        setParams(params)
    }, [])

    return params
}
