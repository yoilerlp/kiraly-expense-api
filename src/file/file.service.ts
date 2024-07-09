import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { S3ClientProviderToken } from './providers/S3Client';
import {
  S3Client,
  PutObjectCommandInput,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { removeSpecialCharacters } from './util';
import { InjectRepository } from '@nestjs/typeorm';
import { File as FileEntity } from './entities/file.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FileService {
  constructor(
    @Inject(S3ClientProviderToken) private readonly s3Client: S3Client,
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
    private readonly configService: ConfigService,
  ) {}

  async uploadFileToStore(file: Express.Multer.File) {
      const bucketFolder = 'public';

      const bucketName = this.configService.get('AWS_S3_BUCKET');

      const region = this.configService.get('AWS_REGION');

      const originalName = removeSpecialCharacters(file.originalname);

      const key = `${bucketFolder}/${Date.now()}_${originalName}`;

      const input: PutObjectCommandInput = {
        Bucket: bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      const command = new PutObjectCommand(input);

      const fileUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;

      await this.s3Client.send(command);

      const fileItem = this.fileRepository.create({
        name: originalName,
        type: file.mimetype,
        size: file.size,
        url: fileUrl,
        key: key,
      });

      return fileItem;
  }

  async uploadMultiplesFilesToStore(files: Express.Multer.File[]) {
    const filesPromises = files.map((file) => this.uploadFileToStore(file));
    const results = await Promise.all(filesPromises);
    return results;
  }

  async removeFileInStore(key: string) {
    if (!key) throw new BadRequestException('Key not found');
    try {
      const deleteParam = {
        Bucket: this.configService.get<string>('AWS_S3_BUCKET'),
        Key: key,
      };
      const deleteFileCommand = new DeleteObjectCommand(deleteParam);
      const result = await this.s3Client.send(deleteFileCommand);
      return {
        result,
        message: 'File deleted successfully',
      };
    } catch (error) {
      console.log(error, key);
      throw new InternalServerErrorException();
    }
  }
}
