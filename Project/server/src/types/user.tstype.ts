import type { Request } from "express";


export type AuthRequest = Request & {
  user?: {
    id: number;
    username : string;
    email: string;
    isVerified: boolean;
    role?: string; 
  };
};
