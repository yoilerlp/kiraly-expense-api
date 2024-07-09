import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import S3ClientProvider from './providers/S3Client';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File as FileEntity } from '@/entities';

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity])],
  controllers: [FileController],
  providers: [FileService, S3ClientProvider],
  exports: [FileService, S3ClientProvider],
})
export class FileModule {}
