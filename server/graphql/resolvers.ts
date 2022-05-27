import {authorResolver} from "./resolvers/author";
import {bookResolver} from "./resolvers/book";
import {loginResolver} from "./resolvers/login";

const resolvers = [loginResolver, authorResolver, bookResolver]

export default resolvers