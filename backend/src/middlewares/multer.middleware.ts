import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

// ✅ Helper: wraps Cloudinary upload_stream in a Promise
const uploadToCloudinary = (buffer: Buffer, options: object): Promise<any> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

export const createUploader = (options: { folder: string }) => {

  const fileFilter = (req: any, file: any, cb: any) => {
    if (options.folder === 'avatars') {
      return file.mimetype.startsWith('image/')
        ? cb(null, true)
        : cb(new Error('Only images allowed for avatars'), false);
    }

    if (
      file.mimetype.startsWith('image/') ||
      file.mimetype.startsWith('video/')
    ) {
      return cb(null, true);
    }

    cb(new Error('Only images or videos allowed'), false);
  };

  const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter,
    limits: { fileSize: 20 * 1024 * 1024 }
  });

  return {
    // ✅ For single file uploads (avatar, single video)
    single: (fieldName: string) => [
      upload.single(fieldName),
      async (req: any, res: any, next: any) => {
        if (!req.file) return next();
        try {
          const result = await uploadToCloudinary(req.file.buffer, {
            folder: `uploads/${options.folder}`,
            resource_type: req.file.mimetype.startsWith('video/') ? 'video' : 'image',
            public_id: options.folder === 'avatars' ? req.user?.id : undefined,
            transformation: options.folder === 'avatars'
              ? [{ width: 500, height: 500, crop: 'fill' }]
              : undefined
          });

          req.file.path = result.secure_url;      // Cloudinary URL
          req.file.filename = result.public_id;   // Cloudinary public_id
          next();
        } catch (err) {
          next(err);
        }
      }
    ],

    // ✅ For multiple file uploads (post images)
    array: (fieldName: string, maxCount: number) => [
      upload.array(fieldName, maxCount),
      async (req: any, res: any, next: any) => {
        if (!req.files || !Array.isArray(req.files)) return next();
        try {
          const uploaded = await Promise.all(
            req.files.map((file: any) =>
              uploadToCloudinary(file.buffer, {
                folder: `uploads/${options.folder}`,
                resource_type: file.mimetype.startsWith('video/') ? 'video' : 'image',
              })
            )
          );

          req.files = req.files.map((file: any, i: number) => ({
            ...file,
            path: uploaded[i].secure_url,
            filename: uploaded[i].public_id,
          }));

          next();
        } catch (err) {
          next(err);
        }
      }
    ]
  };
};