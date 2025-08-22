// config.ts
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Normal app configs
const PORT = Number(process.env.PORT) || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "Your_fallback_secret";
const EMAIL_FROM = process.env.EMAIL_FROM || "";
const EMAIL_PASS = process.env.EMAIL_PASS || "";
const REDIS_HOST = process.env.REDIS_HOST || "127.0.0.1";
const REDIS_PORT = Number(process.env.REDIS_PORT) || 6379;

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };  // cloudinary instance export
export default { PORT, JWT_SECRET, REDIS_PORT, REDIS_HOST, EMAIL_FROM, EMAIL_PASS };
