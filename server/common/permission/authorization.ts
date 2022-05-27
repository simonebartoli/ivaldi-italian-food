import jwt, {JwtPayload} from "jsonwebtoken"
import {PRIVATE_KEY, PUBLIC_KEY} from "../../setting";
import prisma from "../../bin/database";
import {serialize} from "cookie";
import {NextApiRequest, NextApiResponse} from "next";

type AuthError = {
    type: string
    message: string
}
type AuthUser = {
    userID: number
    role: string
}
export type AuthorizationResponse = {
    logged: boolean,
    user?: AuthUser,
    error?: AuthError
}

export let globalAccessToken: string | undefined = undefined
export const removeGlobalAccessToken = () => globalAccessToken = undefined


export const verifySession = async (req: NextApiRequest, res: NextApiResponse): Promise<AuthorizationResponse> => {
    const cookie: string | undefined = req.cookies !== undefined && "token" in req.cookies ? req.cookies.token : undefined
    const token: string | undefined =
        req.headers.authorization !== undefined &&
        req.headers.authorization.split(" ").length ===  2 ?
        req.headers.authorization.split(" ")[1] : undefined

    if(token !== undefined){
        try{
            const decoded: JwtPayload = <JwtPayload> jwt.verify(token, PUBLIC_KEY, {algorithms: ["RS256"]})
            const userID: number = decoded.userID
            const result = await prisma().users.findUnique({
                where: {
                    userID: userID
                },
                rejectOnNotFound: true
            })
            return {
                logged: true,
                user: {
                    userID: result.userID,
                    role: result.role
                }
            }
        }catch (e){
            if(cookie !== undefined) return await checkCookie(cookie, req, res)
            else {
                return {
                    logged: false,
                    error: {
                        type: "INVALID_AUTH",
                        message: "Token Not Valid"
                    }
                }
            }
        }
    }else{
        if(cookie !== undefined) return await checkCookie(cookie, req, res)
        else {
            return {
                logged: false,
                error: {
                    type: "NOT_LOGGED",
                    message: "Session Not Existing"
                }
            }
        }

    }
}

const checkCookie = async (cookie: string, req: NextApiRequest, res: NextApiResponse): Promise<AuthorizationResponse> => {
    try{
        const decoded: JwtPayload = <JwtPayload> jwt.verify(cookie, PUBLIC_KEY, {algorithms: ["RS256"]})
        const tokenID = decoded.tokenID
        const version = decoded.version
        const tokenResult = await prisma().tokens.findUnique({
            where:{
                tokenID: tokenID
            },
            include: {
                users: {
                    select: {
                        role: true
                    }
                }
            },
            rejectOnNotFound: true
        })
        if(tokenResult.version === version){
            await prisma().tokens.update({
                where: {tokenID: tokenID},
                data: {version: version+1}
            })
            const refreshToken: string = jwt.sign({tokenID: tokenID, version: version+1}, PRIVATE_KEY, {algorithm: "RS256", expiresIn: "1d"})
            globalAccessToken = jwt.sign({userID: tokenResult.userID}, PRIVATE_KEY, {algorithm: "RS256", expiresIn: "15m"})

            res.setHeader("Set-Cookie", serialize("token", refreshToken, {secure: true, sameSite: "none"}))
            return {
                logged: true,
                user: {
                    userID: tokenResult.userID,
                    role: tokenResult.users.role
                }
            }
        }else{
            await prisma().tokens.delete({
                where: {
                    tokenID: tokenID
                }
            })
            res.setHeader("Set-Cookie", serialize("token", "", {maxAge: -1, path: "/api"}))
            return {
                logged: false,
                error: {
                    type: "INVALID_AUTH",
                    message: "Version Mismatching"
                }
            }
        }
    }catch (e){
        res.setHeader("Set-Cookie", serialize("token", "", {maxAge: -1, path: "/api"}))
        return {
            logged: false,
            error: {
                type: "INVALID_AUTH",
                message: "Token Not Valid"
            }
        }
    }
}