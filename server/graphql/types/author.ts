import {gql} from "apollo-server-core";

export const authorDefs = gql`
    type Author {
        authorID: Int!
        name: String!
        surname: String!
        age: String!
    }
    extend type Query {
        authors: [Author]
    }
`