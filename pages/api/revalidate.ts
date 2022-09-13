import {NextApiRequest, NextApiResponse} from "next";
import {REVALIDATE_TOKEN} from "../../settings";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Check for secret to confirm this is a valid request
    if (req.query.secret !== REVALIDATE_TOKEN) {
        return res.status(401).json({ message: 'Invalid token' })
    }
    if(req.query.id === undefined) {
        return res.status(400).json({ message: 'ID Missing' })
    }

    try {
        // this should be the actual path not a rewritten path
        // e.g. for "/blog/[slug]" this should be "/blog/post-1"
        const link = `/shop/${req.query.id}`
        await res.revalidate(link)
        return res.json({ revalidated: true })
    } catch (err) {
        // If there was an error, Next.js will continue
        // to show the last successfully generated page
        return res.status(500).send('Error revalidating')
    }
}