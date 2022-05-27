import dotenv from "dotenv"
import * as fs from "fs";
dotenv.config()

export const PRIVATE_KEY = fs.readFileSync("keys/private-key.pem")
export const PUBLIC_KEY = fs.readFileSync("keys/public-key.pem")
