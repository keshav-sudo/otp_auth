import {Response , Request} from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../Utils/db.ts";
import config from "../config/dotenv.ts"
import { sendOTPEmail } from "../Utils/Auth/mailer.ts";
import redisClient from "../Utils/RedisClient.ts";
import { registerSchema, loginSchema,  } from "../types/auth.type.ts";
import { getOtpFromRedis , saveOtpToRedis , verifyOtp } from "../Utils/Auth/Otpstore.ts";
import { sendOtpSchema , verifyOtpSchema  } from "../types/Otp.types.ts";
import { verifyToken , generateToken  } from "../Utils/verifyToken.ts";
import { generateOTP } from "../Utils/Auth/Otpgenerator.ts";

const JWT_SECRET = config.JWT_SECRET as string;
const COOKIE_NAME = "token";


export const register = async(req: Request , res:Response) => {
    
    try {
       const {success , data , error} = registerSchema.safeParse(req.body);
        if(!success){
            return res.status(400).json({
                success:false,
                errors:error.issues
            })
        }

        const existingUser = await prisma.user.findUnique({
            where: {email: data.email},
        });

        if(existingUser){
            return res.status(409).json({
                success : false,
                message : "A user with this email is already exists",
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(data.password ,salt);

        const newUser = await prisma.user.create({
            data: {
                name : data.name,
                email: data.email,
                password: hashedPassword,
                role: data.role,
                isVerified :false,
            }
        })

        const otp = generateOTP(6);
        await saveOtpToRedis(data.email , otp);
        await sendOTPEmail(data.email , otp);

          const token = generateToken({ id: String(newUser.id), email: newUser.email });
         res.cookie(COOKIE_NAME , token , {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 3600000000,
         })

           return res.status(201).json({
            success: true,
            message: "User registered successfully. An OTP has been sent to your email for verification.",
        });
    } catch (error) {
        console.error("Registration Error:", error);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
}