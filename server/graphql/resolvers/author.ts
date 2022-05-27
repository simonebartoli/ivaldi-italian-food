import authors from "../../data/authors";

export const authorResolver = {
    Query: {
        authors: () => authors
    }
}