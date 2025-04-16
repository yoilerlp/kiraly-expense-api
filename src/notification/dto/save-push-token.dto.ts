import { IsUUID, IsString, IsOptional } from 'class-validator';

export class SavePushTokenDto {
  @IsUUID()
  userId: string;

  @IsString()
  token: string;

  @IsOptional()
  @IsString()
  deviceInfo?: string;
}
