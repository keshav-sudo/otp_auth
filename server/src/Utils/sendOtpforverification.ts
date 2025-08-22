import { generateOTP } from "./Auth/Otpgenerator.ts";
import { saveOtpToRedis } from "./Auth/Otpstore.ts";
import { sendOTPEmail } from "./Auth/mailer.ts";

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
