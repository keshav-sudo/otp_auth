import dotenv from "dotenv";
dotenv.config();

const PORT = Number(process.env.PORT) || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "Your_fallback_secret";
const EMAIL_FROM = process.env.EMAIL_FROM;
const EMAIL_PASS = process.env.EMAIL_PASS;
const REDIS_HOST= process.env.REDIS_HOST;
const REDIS_PORT= Number(process.env.REDIS_PORT);
export default { PORT, JWT_SECRET ,REDIS_PORT, REDIS_HOST,  EMAIL_FROM , EMAIL_PASS };
