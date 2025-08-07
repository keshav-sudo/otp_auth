import {Response , Request} from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../Utils/db.ts";
import config from "../config/dotenv.ts"


const JWT_SECRET = config.JWT_SECRET as string;
const COOKIE_NAME = "token";


export const register = async(req: Request , res:Response) => {
    const {name , email , password } = req.body;

}