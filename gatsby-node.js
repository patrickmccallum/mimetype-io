const data = require("./src/mimeData.json")

/**
 * @type {import("gatsby").GatsbyNode["createPages"]}
 */
exports.createPages = async ({ actions }) => {
    const { createPage } = actions

    const templateWeb = require.resolve(
        "./src/shared/templates/MimetypeTemplate.tsx"
    )

    if (!templateWeb) {
        throw new Error("templateWeb not found")
    }

    data.forEach(mimeObject => {
        var path = mimeObject.name

        // Create MimeData for page
        const pageMimeData = {
            ...mimeObject,
            templateData: {
                deprecatedBy: null,
                parentType: null,
            },
        }

        createPage({
            path,
            component: templateWeb,
            context: pageMimeData,
        })

        const appearsAs = mimeObject.appearsAs ? mimeObject.appearsAs : []

        if (pageMimeData.links.deprecates) {
            // Create pages for deprecated mimetypes
            for (const deprecatedTypeName of pageMimeData.links.deprecates) {
                // Create MimeData for page
                const deprecatedPageMimeData = {
                    ...mimeObject,
                    path: deprecatedTypeName,
                    name: deprecatedTypeName,
                    templateData: {
                        deprecatedBy: pageMimeData.name,
                        parentType: pageMimeData.name,
                    },
                }

                createPage({
                    path: deprecatedTypeName,
                    component: templateWeb,
                    context: deprecatedPageMimeData,
                })
            }
        }

        // Create child pages using same MimeData with no deprecatedBy warning
        for (const childTypeName of pageMimeData.links.parentOf) {
            // Create MimeData for page
            const alternativePageMimeData = {
                ...mimeObject,
                path: childTypeName,
                name: childTypeName,
                templateData: {
                    deprecatedBy: null,
                    parentType: pageMimeData.name,
                },
            }

            const newAlternativesList = [
                mimeObject.name,
                ...appearsAs.filter(m => m !== childTypeName),
                ...(mimeObject.alternatives || []),
            ]

            createPage({
                path: childTypeName,
                component: templateWeb,
                context: alternativePageMimeData,
            })
        }

        // Create child pages using same MimeData with no deprecatedBy warning
        for (const alternativeTypeName of pageMimeData.links.alternativeTo) {
            // Create MimeData for page
            const alternativePageMimeData = {
                ...mimeObject,
                path: alternativeTypeName,
                name: alternativeTypeName,
                templateData: {
                    deprecatedBy: null,
                    parentType: null,
                },
            }

            const newRelatedList = [
                mimeObject.name,
                ...pageMimeData.links.relatedTo.filter(
                    m => m !== alternativeTypeName
                ),
            ]

            const newAlternativesList = [
                mimeObject.name,
                ...pageMimeData.links.alternativeTo.filter(
                    m => m !== alternativeTypeName
                ),
            ]

            createPage({
                path: alternativeTypeName,
                component: templateWeb,
                context: {
                    ...alternativePageMimeData,
                    links: {
                        ...pageMimeData.links,
                        relatedTo: newRelatedList,
                        alternativeTo: newAlternativesList,
                    },
                },
            })
        }
    })
}
