import { useMemo, useState } from "react"

export const useParams = () => {
    const [params, setParams] = useState<URLSearchParams>(new URLSearchParams())

    useMemo(() => {
        const params = new URLSearchParams(document.location.search)

        setParams(params)
    }, [location])

    return params
}
