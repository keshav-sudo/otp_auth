
import jwt from "jsonwebtoken";
import config from "../config/dotenv.ts";



interface Tokenpayload {
    id : string;
    isVerified : boolean;
    email?: string;
    username? : string ;
    role?: "user" | "admin"; 
    iat?: number;         
    exp?: number;        
}


export const verifyToken = (token :string): Tokenpayload => {
    if(!config.JWT_SECRET){
        throw new Error("JWT_SECRET is not defined");
    }
    try {
         const decode = jwt.verify(token , config.JWT_SECRET) as Tokenpayload;
         return decode;
    } catch (error) {
         throw new Error("Invalid token");
    }
    
};

export const generateToken = (payload: Tokenpayload): string => {
    if (!config.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
    }

    return jwt.sign(payload, config.JWT_SECRET, {
        expiresIn: "7d", 
    });
};