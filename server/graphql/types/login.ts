import {gql} from "apollo-server-core";

export const loginDefs = gql`
    extend type Mutation {
        login(email: String!, password: String!): String!
    }
`
