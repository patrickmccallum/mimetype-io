const data = require("./mimeData.json")

/**
 * @type {import('gatsby').GatsbyNode['createPages']}
 */
exports.createPages = async ({ actions }) => {
    const { createPage } = actions

    const templateWeb = require.resolve(
        "./src/shared/templates/MimetypeTemplate.tsx"
    )

    if (!templateWeb) {
        throw new Error("templateWeb not found")
    }
    //
    // createPage({
    //     path: "/using-dsg",
    //     component: require.resolve("./src/shared/templates/using-dsg.js"),
    //     context: {},
    //     defer: true,
    // })

    data.forEach(mimeObject => {
        if (mimeObject.deprecated) {
            return
        }

        var path = mimeObject.name

        createPage({
            path,
            component: templateWeb,
            context: {
                ...mimeObject,
                alternatives: mimeObject.alternatives || [],
            },
        })

        const appearsAs = mimeObject.appearsAs ? mimeObject.appearsAs : []

        if (mimeObject.alternatives) {
            for (const alternative of mimeObject.alternatives) {
                const newAlternativesList = [
                    ...appearsAs,
                    ...mimeObject.alternatives.filter(m => m !== alternative),
                    mimeObject.name,
                ]

                createPage({
                    path: alternative,
                    component: templateWeb,
                    context: {
                        ...mimeObject,
                        name: alternative,
                        deprecated: true,
                        useInstead: mimeObject.name,
                        alternatives: newAlternativesList,
                    },
                })
            }
        }

        for (const alternative of appearsAs) {
            const newAlternativesList = [
                mimeObject.name,
                ...appearsAs.filter(m => m !== alternative),
                ...(mimeObject.alternatives || []),
            ]

            createPage({
                path: alternative,
                component: templateWeb,
                context: {
                    ...mimeObject,
                    name: alternative,
                    deprecated: false,
                    useInstead: mimeObject.name,
                    alternatives: newAlternativesList,
                },
            })
        }
    })
}
