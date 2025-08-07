import * as nodemailer from "nodemailer"; 
import config from "../config/dotenv.ts"

const FROM = config.EMAIL_FROM;
const PASS = config.EMAIL_PASS;

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user : FROM,
        pass : PASS
        
    },
});


export const sendOTPEmail = async (to: string , otp: string) => {
    const mailOptions = {
        from: `Todo App`,
        to, 
        subject: "Your OTP Code",
        html: `
      <div style="font-family: sans-serif;">
        <h2>Your OTP Code</h2>
        <p>Your One-Time Password is: <strong>${otp}</strong></p>
        <p>This OTP is valid for 5 minutes.</p>
      </div> `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
         console.log("OTP email sent:", info.response);
         return true;
    } catch (error) {
        console.error("Failed to send email:", error);
    return false;
    }
};


