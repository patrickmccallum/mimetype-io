export interface MimeData {
    name: string
    description?: string
    fileTypes: Array<string>
    links: {
        deprecates: Array<string>
        relatedTo: Array<string>
        parentOf: Array<string>
        alternativeTo: Array<string>
    }
    notices: {
        /** No registered media type exists for this format. */
        hasNoOfficial: boolean
        /** The type people actually use in practice, where it differs. */
        popularUsage: string | null
    }
    furtherReading?: Array<{
        title: string
        url: string
    }>
    templateData: {
        parentType: string | null
        deprecatedBy: string | null
    }
}
