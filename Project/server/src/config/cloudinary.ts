import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinary } from "./dotenv.ts";


const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "my-app", 
    allowed_formats: ["jpg", "png", "jpeg", "webp"], 
  },
});

// Upload middleware
const upload = multer({ storage });

export default upload;
