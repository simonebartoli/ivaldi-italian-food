import {gql} from "apollo-server-core";

export const customResponses = gql`
    interface Response {
        status: String!
        time: String!
        message: String!
    }

    type BookResponse implements Response{
        status: String!
        time: String!
        message: String!
        book: Book!
    }

`