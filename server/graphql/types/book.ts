import {gql} from "apollo-server-core";

export const bookDefs = gql`
    type Book {
        bookID: Int!
        title: String!
        price: Int!
        author: Author!
    }

    extend type Query {
        books: [Book!]
        book(title: String!): Book
    }

    extend type Mutation {
        addBook(bookID: Int!, title: String!, price: Int!, authorID: Int!): BookResponse
    }
`