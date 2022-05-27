import authors from "../../data/authors";
import books from "../../data/books";
import responseCreator from "../../common/response_creator";
import NotFoundError from "../errors/not_found";
import {adminChecker} from "../../common/permission/checker";

export const bookResolver = {
    Query: {
        books: (parent: undefined, args: any, context: any) => {
            adminChecker(context.loginInfo)
            return books
        },
        book: (parent: undefined, args: any) => {
            const book = books.find(book => book.title === args.title)
            if(book !== undefined) return book
            else throw new NotFoundError("Book Not Found")
        }
    },

    Mutation: {
        addBook: (parent: any, args: any) => {
            const newBook = {
                bookID: args.bookID,
                title: args.title,
                price: args.price,
                authorID: args.authorID
            }
            books.push(newBook)
            return responseCreator("OK", "Book Added", "book", newBook)
        }
    },

    Book: {
        author: (parent: any) => {
            return authors.find(author => author.authorID === parent.authorID)
        }
    }
}
