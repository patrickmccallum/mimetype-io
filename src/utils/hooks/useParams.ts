import { useMemo } from "react"

export const useParams = () => {
    return useMemo(() => {
        const params = new URLSearchParams(document.location.search)
        const paramsMap: Record<string, string> = {}

        console.info(params, paramsMap, document.location)

        for (const key of Object.keys(params)) {
            paramsMap[key] = params[key]
        }

        console.info("map", paramsMap)

        return params
    }, [document.location.search])
}
