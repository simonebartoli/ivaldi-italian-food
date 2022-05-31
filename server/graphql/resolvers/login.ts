import jwt from "jsonwebtoken";
import {PRIVATE_KEY} from "../../setting";
import {loginVal} from "../../common/validator/login_val";
import prisma from "../../bin/database";
import {AuthenticationError} from "apollo-server-micro";
import {ForbiddenError} from "apollo-server-core";
import { serialize } from 'cookie';

export const loginResolver = {
    Mutation: {
        login: async (parent: any, args: any, {loginInfo, res}: any) => {
            loginVal(args)
            if(loginInfo.logged) throw new ForbiddenError("Already Logged")

            const userResult = await prisma().users.findFirst({
                where: {
                    email: args.email,
                    password: args.password
                }
            })
            if(userResult === null) throw new AuthenticationError("LoginSection/Password Are Wrong")

            const tokenResult = await prisma().tokens.create({
                data:{
                    userID: userResult.userID
                }
            })

            const refreshToken: string = jwt.sign({tokenID: tokenResult.tokenID, version: tokenResult.version}, PRIVATE_KEY, {algorithm: "RS256", expiresIn: "1d"})
            const accessToken: string = jwt.sign({userID: userResult.userID}, PRIVATE_KEY, {algorithm: "RS256", expiresIn: "15m"})

            res.setHeader("Set-Cookie", serialize("token", refreshToken, {secure: true, sameSite: "none"}))
            return accessToken
        }
    }
}