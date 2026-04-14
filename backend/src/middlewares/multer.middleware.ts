import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs'

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.user?.id;

    const userDir = `public/uploads/avatars/${userId}`
      fs.mkdirSync(userDir, {recursive: true})
    cb(null, userDir); 
  },

  filename: (req, file, cb) => {
    const userId = req.user?.id;

    // Overwritting the avatar file
    const filename = `${userId}${path.extname(file.originalname)}`
    // const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, filename);
  }
});

const fileFilter = (req: any, file : any, cb: any) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only images allowed!'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter
});

export const singleAvatarUpload = upload.single('avatar');
export const multipleUpload = upload.array('images', 5); // Up to 5 images
