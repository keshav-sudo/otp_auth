import { email, z } from "zod";


const roleEnum = z.enum(["USER", "ADMIN"]);


export const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: roleEnum.optional().default("USER"), // Default role
});


export const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long").optional(),
  email: z.string().email("Invalid email").optional(),
  password: z.string().min(6, "Password is required"),
}).refine(data => data.username || data.email, {
    message: "Either email or username is required.",
    path: ["_global"] 
});


export const verifyOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export const resetpasswordschema = z.object({
  email : z.string().email(),
})

export const resetpasswordfinalschema = z.object({
  email : z.string().email(),
  newpassword: z.string().min(6, "Password is required"),
})

export const usernameSchema = z.object({ 
   username: z.string().min(3, "Username must be at least 3 characters long").optional(),
})