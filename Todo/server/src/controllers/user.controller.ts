import type { AuthRequest } from "../types/user.tstype.ts";
import type { NextFunction, Response } from "express"; 


const getme = (req: AuthRequest, res: Response) => {
  const { id, email, isVerified, role } = req.user!;
  return res.json({ id, email, isVerified, role });
};

export default {
  getme,
};