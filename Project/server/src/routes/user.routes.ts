import { Router } from "express";
import userController from "../controllers/user.controller.ts";
import { Middleware } from "../Middleware/middleware.ts";
const router = Router();

router.get("/" , Middleware ,userController.getme);



export default router;