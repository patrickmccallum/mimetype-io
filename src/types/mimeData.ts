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
        hasNoOfficial: boolean
        communityContributed: boolean
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
