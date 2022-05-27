import {gql} from "apollo-server-core";
import {authorDefs} from "./types/author";
import {bookDefs} from "./types/book";
import {customResponses} from "./types/response";
import {loginDefs} from "./types/login";

const init = gql`
    type Query
    type Mutation
`

const typeDefs = [init, loginDefs, customResponses, authorDefs, bookDefs]

export default typeDefs