export interface MimeData {
    name: string
    description?: string
    types: string[]
    alternatives: string[]
    appearsAs: string[]
    furtherReading?: Array<{
        title: string
        url: string
    }>
    deprecated?: boolean
    useInstead?: string
}
