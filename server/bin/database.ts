import {PrismaClient} from "@prisma/client";

let prismaClient: PrismaClient | undefined = undefined

const prisma = (): PrismaClient => {
    if(prismaClient === undefined){
        prismaClient = new PrismaClient()
    }
    return prismaClient
}
export default prisma