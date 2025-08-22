import dotenv from "dotenv";
dotenv.config();
const config = {
    PORT: Number(process.env.PORT) || 5000,
    JWT_SECRET: process.env.JWT_SECRET || "Your_fallback_scret",
};
export default config;
//# sourceMappingURL=dotenv.js.map