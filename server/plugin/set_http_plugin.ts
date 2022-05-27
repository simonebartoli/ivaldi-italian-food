import {globalAccessToken, removeGlobalAccessToken} from "../common/permission/authorization";

export const setHttpPlugin = {
    async requestDidStart() {
        return {
            async willSendResponse({response}: any) {
                if (response?.errors === undefined && globalAccessToken !== undefined) {
                    response.extensions = {
                        accessToken: globalAccessToken
                    }
                    removeGlobalAccessToken()
                }

                if (response?.errors?.[0]?.extensions.code === 'UNAUTHENTICATED') {
                    response.http.status = 403;
                }
                if (response?.errors?.[0]?.extensions.code === 'OBJECT_NOT_FOUND') {
                    response.http.status = 404;
                }
            }
        };
    }

};