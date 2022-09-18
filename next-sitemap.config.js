/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://ivaldi.uk',
    generateRobotsTxt: true,
    additionalPaths: async (config) => {
        const result = []
        for(let i = 1; i<= 100; i++){
            result.push({
                loc: `/shop/${i}`,
                changefreq: 'daily',
                priority: 0.7,
                lastmod: new Date().toISOString(),
            })
        }
        return result
    }
}