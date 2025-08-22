import jwt from "jsonwebtoken"
import type { AuthRequest } from "../types/user.tstype.ts";
import type { NextFunction, Response } from "express"; 
import prisma from "../Utils/db.ts";
import { usernameSchema } from "../types/auth.type.ts";
import dotenv from "../config/dotenv.ts";


const getme = (req: AuthRequest, res: Response) => {
  const { id, email, isVerified, role } = req.user!;
  return res.json({ id, email, isVerified, role });
};





const checkusername  = async(req : Request , res:Response) => {

  try {

  const {data ,  success} = usernameSchema.safeParse(req.body);

  if(!data?.username){
    return res.status(400).json({ message: "Username is required" });
  }

  const existinguser = await prisma.user.findUnique({
    where: { username: data.username.toLowerCase() }

  });

  if (!existinguser) {
      return res.json({ available: false, message: "Username already taken" });
    }

    res.json({ available: true, message: "Username is available" });

    
  } catch (error) {
    return res.status(400).json({
      success : false,
      message : "Internal server error"
    })
    
  }

}


const setUsername = async(req : AuthRequest , res:Response) => {

  try {

  const {data , success , error} = usernameSchema.safeParse(req.body);
  if(!success){
    return res.status(400).json({
      success : false,
      error : error.issues
    })
  }

   const updatedUser = await prisma.user.update({
    where: { id: req.user!.id },
    data: { username: data.username?.toLowerCase() },
  });

  if (updatedUser.username !== null) {
  req.user!.username = updatedUser.username;
}

 const newToken = jwt.sign(req.user! , dotenv.JWT_SECRET! , { expiresIn: "7d" } );


res.cookie("token", newToken, { httpOnly: true, sameSite: "lax" });

return res.status(200).json({
  success : true,
  message : `${data.username} is your new username`
})
    
  } catch (error) {
    return res.status(400).json({
      success : false,
      error : error
    })

  }

}
export default {
  getme,
  checkusername,
  setUsername
};