import { email, z } from "zod";


const roleEnum = z.enum(["USER", "ADMIN"]);


export const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: roleEnum.optional().default("USER"), // Default role
});


export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password is required"),
});


export const verifyOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export const resetpasswordschema = z.object({
  email : z.string().email(),
})