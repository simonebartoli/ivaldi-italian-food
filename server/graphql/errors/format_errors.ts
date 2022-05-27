import {GraphQLFormattedError} from "graphql";
import {ApolloError} from "apollo-server-core";
import moment from "moment";

const formatErrors = (err: ApolloError): GraphQLFormattedError => {
    return {
        message: err.message,
        extensions: {
            code: err.extensions.code,
            time: moment().toString()
        }
    }
}

export default formatErrors