import {ApolloServer} from "apollo-server-micro";
import {verifySession} from "../../server/common/permission/authorization";
import formatErrors from "../../server/graphql/errors/format_errors";
import {setHttpPlugin} from "../../server/plugin/set_http_plugin";
import typeDefs from "../../server/graphql/schema";
import resolvers from "../../server/graphql/resolvers";
import initMiddleware from "../../server/init-middleware";
import cors from "cors"

const server = new ApolloServer({
    typeDefs,
    resolvers,
    debug: true,
    context: async ({ req, res }) => ({
        loginInfo: await verifySession(req, res),
        res: res
    }),
    formatError: (err) => formatErrors(err),
    plugins: [
        setHttpPlugin
    ],
});
const startServer = server.start()

const Cors = initMiddleware(
    cors({
        origin: "https://studio.apollographql.com",
        credentials: true
    })
)

export default async function handler(req: any, res: any){
    await Cors(req, res)
    await startServer;
    await server.createHandler({
        path: "/api/graphql"
    })(req, res)
}

export const config = {
    api: {
        bodyParser: false
    }
}