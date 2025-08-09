
import { generateOTP } from "./Otpgenerator.ts";
import { saveOtpToRedis } from "./Otpstore.ts";
import { sendOTPEmail } from "./mailer.ts";

export const senOtpforverification = async (email: string)=>{
    const Otp = generateOTP(6);
    await saveOtpToRedis(email , Otp);
    await sendOTPEmail(email , Otp);
}