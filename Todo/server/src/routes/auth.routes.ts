import { Router } from "express";
import authController from "../controllers/auth.controller.ts";
const router = Router();


router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/verify-otp", authController.verify_otp);

export default router;