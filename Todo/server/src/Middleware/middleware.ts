import type { AuthRequest } from "../../src/types/user.tstype.ts";
import type { Response, NextFunction } from "express";
import { verifyToken } from "../../src/Utils/verifyToken.ts";

export const Middleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(400).json({
        message: "First login, then hit this API",
      });
    }

    const verify = verifyToken(token);

    if (!verify) {
      return res.status(400).json({
        message: "Error while fetching data",
      });
    }

    req.user = {
      id: Number(verify.id),
      email: String(verify.email),
      isVerified: Boolean(verify.isVerified),
      role: verify.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized: Invalid token",
      error,
    });
  }
};
