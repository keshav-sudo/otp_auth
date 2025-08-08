import {z} from "zod";


export const sendOtpSchema = z.object({
  email: z.string().email({ message: "Invalid email address" })
});

export const verifyOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6, { message: "OTP must be 6 digits" })
});