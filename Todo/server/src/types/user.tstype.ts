import type { Request } from "express";

// Export as type, not interface
export type AuthRequest = Request & {
  user?: {
    id: number;
    email: string;
    isVerified: boolean;
    role?: string; // optional role
  };
};
