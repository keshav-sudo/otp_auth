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


    const register = async(req: Request , res:Response) => {
    
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

        return res.status(201).json({
        success: true,
        message: "User registered. OTP sent to your email for verification.",
        next: "verify-otp",
        });

        

    } catch (error) {
        console.error("Registration Error:", error);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
}

    const verify_otp= async(req: Request , res:Response ) => {

    try {
        const {email} = req.params;
        const {otp} = req.body;

     
        const {success , data , error} = verifyOtpSchema.safeParse({email , otp});
               if(!success){
            return res.status(400).json({
                success:false,
                errors:error.issues
            })
        }

        const isValid = await verifyOtp(data.email, data.otp);
        if(!isValid){
            return res.status(400).json({
                success : false,
                masage: "Invailid or wrong otp inputs"
            })
        }

        const userfind = await prisma.user.update({
            where: {email},
            data: {isVerified: true}

        });

        if(!userfind){
            return res.status(400).json({
                success : false,
                massage : "Cant find email "
            }) }

        await redisClient.del(`otp:${data?.email}`);

            const token = generateToken({
              id: String(userfind.id),
              email: userfind.email,
             });

           res.cookie(COOKIE_NAME, token, {
           httpOnly: true,
           secure: process.env.NODE_ENV === "production",
           maxAge: 7 * 24 * 60 * 60 * 1000, 
       });


        return res.json({ success: true, message: "OTP verified, account activated" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Server error" });
    }

};

    const login = async (req : Request , res: Response) => {
    try {
        
        const {email ,password } = req.body;
        const {success , data , error} = loginSchema.safeParse(req.body);

        

        if (!success) {
            return res.status(400).json({
                success: false,
                errors: error.issues
            });
        }
       console.log("in before 1");
          const findUser = await prisma.user.findUnique({
            where: { email: data.email },
            select: {
                id: true,
                email: true,
                isVerified: true,
                password : true
            }
        });

      

        if(!findUser) {
            return res.status(404).json({
                success : false,
                massage : "User not find"
            });
        }

        const isMatch = await bcrypt.compare(data.password , findUser?.password!);

        if(!isMatch){
            return res.status(400).json({
                message: "User not found"
            })
        }

        const isverification = findUser?.isVerified == true ;
        if(isverification){
            const token = generateToken({id : findUser.id.toString(), email : findUser.email});
            res.cookie(COOKIE_NAME , token, {
                httpOnly : true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 7 * 24 * 60 * 60 * 1000,
                })

            return res.status(201).json({
            success: true,
            message: "User login successfully",
        });
        }
       
             const otp = generateOTP(6);

             await saveOtpToRedis(data.email , otp);

             await sendOTPEmail(data.email ,  otp);


            return res.status(403).json({
                success : false,
                message : "Your account is not verified firstly verify the account",
                redirect : "verify-otp"
            }) 
        

          
          
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
}


export default {
      register ,
      login,
      verify_otp
}