import { generateOTP } from "./Otpgenerator.ts";
import { saveOtpToRedis } from "./Otpstore.ts";
import { sendOTPEmail } from "./mailer.ts";

export const senOtpforverification = async (email: string): Promise<boolean> => {
    try {
        const Otp = generateOTP(6);
        await saveOtpToRedis(email, Otp);
        await sendOTPEmail(email, Otp);
        return true;   
    } catch (error) {
        console.error("Error sending OTP:", error);
        return false;  
    }
}
