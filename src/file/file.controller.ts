import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  Delete,
  Body,
} from '@nestjs/common';
import { FileService } from './file.service';
import { BasicFileInterceptor } from '@/common/interceptors/file';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @UseInterceptors(
    BasicFileInterceptor({
      sizeInMb: 5,
    }),
  )
  uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: true,
        errorHttpStatusCode: 400,
      }),
    )
    file: Express.Multer.File,
  ) {
    console.log({ file });
    return this.fileService.uploadFileToStore(file);
  }

  @Delete()
  deleteFile(@Body() body: any) {
    const { fileKey } = body;
    return this.fileService.removeFileInStore(fileKey);
  }
}
