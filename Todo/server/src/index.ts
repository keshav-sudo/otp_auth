// server/src/index.ts
import { sendOTPEmail } from './Utils/mailer.ts';
import express from 'express';
import config from "../src/config/dotenv.ts";


const app = express();
const PORT = config.PORT || 5000;

(async () => {
    const email = 'keshup1m@gmail.com'; // ✅ Replace with your test email
    const otp = '123456';
    const result = await sendOTPEmail(email, otp);

    if (result) {
        console.log(' Test OTP email sent successfully!');
    } else {
        console.log('Failed to send test OTP email.');
    }
})();

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
