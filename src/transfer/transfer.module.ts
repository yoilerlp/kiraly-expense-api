import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { TransferFile } from '@/entities';

import { TransferService } from './transfer.service';
import { TransferController } from './transfer.controller';
import { Transfer } from './entities/transfer.entity';
import { FileModule } from '@/file/file.module';

@Module({
  imports: [TypeOrmModule.forFeature([Transfer, TransferFile]), FileModule],
  controllers: [TransferController],
  providers: [TransferService],
  exports: [TransferService],
})
export class TransferModule {}
