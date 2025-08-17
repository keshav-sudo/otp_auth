import express from "express";
import type { Request, Response } from "express";
import type { AuthRequest } from "../types/user.tstype.ts";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../Utils/db.ts";
import { senOtpforverification } from "../Utils/Auth/sendOtpforverification.ts";
import config from "../config/dotenv.ts"

import redisClient from "../Utils/RedisClient.ts";
import { registerSchema, loginSchema,  } from "../types/auth.type.ts";
import { verifyOtp } from "../Utils/Auth/Otpstore.ts";
import { resetpasswordschema } from "../types/auth.type.ts";
import {  verifyOtpSchema  } from "../types/Otp.types.ts";
import {  generateToken  } from "../Utils/verifyToken.ts";
import { tr } from "zod/locales";


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

        const sendotp = await senOtpforverification(data.email);

        return res.status(201).json({
        success: true,
        message: "User registered. OTP sent to your email for verification.",
        data : {
            next: "verify-otp",
        }
        
        });

        

    } catch (error) {
        console.error("Registration Error:", error);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
}

    const verify_otp= async(req: Request , res:Response ) => {

    try {
       
        const {email,otp} = req.body;

     
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
                message : "Invailid or wrong otp inputs"
            })
        }

        const userfind = await prisma.user.update({
            where: {email},
            data: {isVerified: true}

        });

        if(!userfind){
            return res.status(400).json({
                success : false,
                message : "Cant find email "
            }) }

        await redisClient.del(`otp:${data?.email}`);

            const token = generateToken({
              id: String(userfind.id),
              email: userfind.email,
              isVerified : userfind.isVerified
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
                message : "User not find"
            });
        }

        const isMatch = await bcrypt.compare(data.password , findUser?.password!);

        if(!isMatch){
            return res.status(400).json({
                message: "User given Password is not matched"
            })
        }

        const isverification = findUser?.isVerified == true ;
        if(isverification){
            const token = generateToken({id : findUser.id.toString(), 
              isVerified : findUser.isVerified,
               email : findUser.email});
            res.cookie(COOKIE_NAME , token, {
                httpOnly : true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            return res.status(201).json({
            success: true,
            message: "User login successfully",
        });
        }
          
          
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
}

const reset_password = async(req: Request , res:Response) => {
    const {email} = req.body;
    const {data , success , error} = resetpasswordschema.safeParse(req.body);
    if(!success){
        return res.status(400).json({
            message : "given body is not right" 
        })
    }

    const findUser = await prisma.user.findUnique({
        where : {email : data.email},
        select : {
            id : true,
            isVerified : true ,
            name : true,
            email  :true
        }
    })

    if(!findUser || !findUser.email){
        return res.status(400).json({
            message : "Your not find in the database"
        })
    }
    

   const send = await senOtpforverification(findUser.email);
     if (!send) {
        return res.status(400).json({
            message: "There was some error while sending reset email"
        });
    }



   return res.status(200).json({
    message : "Your have redirect in reset-password route",
    data : {
        redirect : "reset_otp_verification"
    }
    
   })


}
export const reset_otp_verification = async (req: Request, res: Response) => {
  try {
    const parseResult = verifyOtpSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: "Given body is not valid",
        errors: parseResult.error?.issues,
      });
    }
    const { email, otp } = parseResult.data;

    const isOtpValid = await verifyOtp(email, otp);
    if (!isOtpValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    return res.json({
      success: true,
      message: "OTP is verified, now you can change your password",
      redirect: "reset-password",
    });
  } catch (error) {
    console.error("Reset OTP Verification Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const reset_password_final = async (req: Request, res: Response) => {
  // Assume loginSchema me email aur newpassword defined hai
  const { success, data, error } = loginSchema.safeParse(req.body);

  if (!success) {
    return res.status(400).json({
      message: "There is some error in new password or email",
      error,
    });
  }

  const findUser = await prisma.user.findUnique({
    where: { email: data.email },
    select: {
      id: true,
      password: true,
      email: true,
      isVerified: true,
      name: true,
    },
  });

  if (!findUser) {
    return res.status(404).json({ message: "User not found" });
  }


  const isPasswordSame = await bcrypt.compare(data.password, findUser.password);


  if (!findUser.isVerified || !isPasswordSame) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const updatedUser = await prisma.user.update({
      where: { email: data.email },
      data: {
        isVerified: true,
        password: hashedPassword,
      },
    });

    if (!updatedUser) {
      return res.status(500).json({
        message: "Failed to update password",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Password updated and user verified successfully",
      user: {
        name: updatedUser.name,
        email: updatedUser.email,
      },
    });
  }

  
  return res.status(200).json({
    success: true,
    message: "User is already verified and password is up-to-date",
  });
};
 
// at the bottom of user.controller.ts
const userController = {
  register,
  login,
  verify_otp,
  reset_otp_verification,
  reset_password,
  reset_password_final
};

export default userController;
