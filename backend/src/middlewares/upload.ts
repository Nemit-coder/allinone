import { createUploader } from './multer.middleware';

// 👤 Avatar upload (single)
export const singleAvatarUpload =
  createUploader({ folder: 'avatars' }).single('avatar');

// 🖼 Images upload (multiple)
export const multipleImageUpload =
  createUploader({ folder: 'posts' }).array('media', 5);

// 🎥 Video upload (single)
export const singleVideoUpload =
  createUploader({ folder: 'posts' }).single('media');