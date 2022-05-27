import {ApolloError} from "apollo-server-core";

export default class NotFoundError extends ApolloError{
    constructor(message: string) {
        super(message, 'OBJECT_NOT_FOUND');
    }
}