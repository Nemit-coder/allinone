import multer from 'multer';
import path from 'path';
import fs from 'fs';

// 🔥 reusable factory
export const createUploader = (options: { folder: string }) => {
  const storage = multer.diskStorage({
    destination: (req: any, file, cb) => {
      const userId = req.user?.id;

      const uploadPath = `public/uploads/${options.folder}/${userId}`;

      fs.mkdirSync(uploadPath, { recursive: true });

      cb(null, uploadPath);
    },

    filename: (req: any, file, cb) => {
      const ext = path.extname(file.originalname);

      if (options.folder === 'avatars') {
        cb(null, `${req.user?.id}${ext}`);
      } else {
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
        cb(null, unique);
      }
    }
  });

  const fileFilter = (req: any, file: any, cb: any) => {
    if (options.folder === 'avatars') {
    return file.mimetype.startsWith('image/')
      ? cb(null, true)
      : cb(new Error('Only images allowed for avatars'), false);
  }

  // posts → allow both image + video
  if (
    file.mimetype.startsWith('image/') ||
    file.mimetype.startsWith('video/')
  ) {
    return cb(null, true);
  }

  cb(new Error('Only images or videos allowed'), false);
  };

  return multer({
    storage,
    fileFilter,
    limits: { fileSize: 20 * 1024 * 1024 }
  });
};