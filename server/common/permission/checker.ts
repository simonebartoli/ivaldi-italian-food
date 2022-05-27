import {AuthorizationResponse} from "./authorization";
import {AuthenticationError} from "apollo-server-micro";

export const adminChecker = (loginInfo: AuthorizationResponse) => {
    loginChecker(loginInfo)
    if(!loginInfo.logged || loginInfo.user?.role !== 'Admin') throw new AuthenticationError("Admin Right Needed")
}

export const loginChecker = (loginInfo: AuthorizationResponse) => {
    if(!loginInfo.logged) throw new AuthenticationError(loginInfo.error!.message)
}