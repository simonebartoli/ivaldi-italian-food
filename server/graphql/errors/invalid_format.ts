import {ApolloError} from "apollo-server-core";

export default class InvalidFormat extends ApolloError{
    constructor(message: string) {
        super(message, 'INVALID_FORMAT');
    }
}