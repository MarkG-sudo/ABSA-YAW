
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import "dotenv/config";


// Cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


// User avatar storage
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "Agrigain-Profiles",
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'tiff', 'svg', 'avif'],
        public_id: (req, file) => {
            const userId = req.auth?.id || "anonymous";
            const timestamp = Date.now();
            const ext = file.originalname.split('.').pop();
            return `avatar-${userId}-${timestamp}.${ext}`;
        }
    }
});



// Asset icon storage
const imageStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "Agrigain-Profiles",
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'tiff', 'svg', 'avif'],
        public_id: (req, file) => `image-${Date.now()}`
    }
});

export const upload = multer({ storage });
export const assetImageUpload = multer({ storage: imageStorage });




export default cloudinary;