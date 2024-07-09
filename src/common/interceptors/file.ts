import { BadRequestException } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

const generateFilesOptions = ({
  sizeInMb,
}: {
  sizeInMb: number;
}): MulterOptions => {
  return {
    limits: {
      fileSize: 1024 * 1024 * sizeInMb,
    },
    fileFilter: (req, file, cb) => {
      const pdfMine = 'application/pdf';
      const allowedMimes = ['image/png', 'image/jpeg', pdfMine];
      if (allowedMimes.includes(file.mimetype) && file) {
        cb(null, true);
      } else {
        cb(new BadRequestException('File must be PNG, JPEG/JPG or PDF'), false);
      }
    },
  };
};

export const BasicFileInterceptor = (configInterceptor?: {
  key?: string;
  sizeInMb?: number;
}) => {
  const { sizeInMb = 3, key = 'file' } = configInterceptor || {};
  return FileInterceptor(key, generateFilesOptions({ sizeInMb }));
};
export const BasicFilesInterceptor = (configInterceptor?: {
  key?: string;
  sizeInMb?: number;
}) => {
  const { sizeInMb = 3, key = 'files' } = configInterceptor || {};
  return FilesInterceptor(key, 10, generateFilesOptions({ sizeInMb }));
};
