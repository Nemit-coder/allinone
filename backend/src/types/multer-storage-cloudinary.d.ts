declare module 'multer-storage-cloudinary' {
  import { StorageEngine } from 'multer';
  import { v2 as cloudinary } from 'cloudinary';

  interface CloudinaryStorageOptions {
    cloudinary: typeof cloudinary;
    params: (
      req: any,
      file: Express.Multer.File
    ) => Promise<any> | {
      folder?: string;
      resource_type?: string;
      public_id?: string;
      transformation?: any[];
      [key: string]: any;
    };
  }

  export class CloudinaryStorage implements StorageEngine {
    constructor(options: CloudinaryStorageOptions);
    _handleFile(req: any, file: Express.Multer.File, callback: (error: Error | null, info?: any) => void): void;
    _removeFile(req: any, file: any, callback: (error: Error | null) => void): void;
  }
}
