import dotenv from "dotenv";
dotenv.config();

const PORT = Number(process.env.PORT) || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "Your_fallback_secret";
const EMAIL_FROM = process.env.EMAIL_FROM;
const EMAIL_PASS = process.env.EMAIL_PASS;

export default { PORT, JWT_SECRET , EMAIL_FROM , EMAIL_PASS };
