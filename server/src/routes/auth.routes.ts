import { Router } from "express";
import authController from "../controllers/auth.controller.ts";
const router = Router();


router.post("/register", authController.register);
router.post("/login", authController.login);

router.post("/logout", authController.logout);
router.post("/verify-otp", authController.verify_otp);
router.post("/reset-password" , authController.reset_password);
router.post("/reset-password-otp" , authController.reset_otp_verification);
router.post( "/reset-password-final" , authController.reset_password_final);

export default router;