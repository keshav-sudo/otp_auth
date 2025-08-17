import { Router } from "express";
import userController from "../../src/controllers/user.controller.ts";
import { Middleware } from "../../src/Middleware/middleware.ts";
const router = Router();

router.get("/" , Middleware ,userController.getme);



export default router;