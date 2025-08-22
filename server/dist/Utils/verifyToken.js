// server/src/utils/generateToken.ts (or wherever your file is located)
import jwt from "jsonwebtoken";
import config from "../config/dotenv";
export const generateToken = (id) => {
    return jwt.sign({ id }, config.JWT_SECRET, { expiresIn: '1h' });
};
//# sourceMappingURL=verifyToken.js.map