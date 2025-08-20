import { Router, Request, Response } from "express";
import userController from "../controllers/user.controller.ts";
// import { Middleware } from "../Middleware/middleware.ts";
import upload from "../config/cloudinary.ts";

const router = Router();

// // Get user
// router.get("/", Middleware, userController.getme);

// Upload Image
router.post("/upload", upload.single("image"), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  res.json({
    message: "File uploaded successfully!",
    fileUrl: req.file.path, // Cloudinary URL
  });
});

export default router;
