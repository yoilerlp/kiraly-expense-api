import { plainToInstance } from 'class-transformer';
import { IsNumber, IsString, validateSync } from 'class-validator';

class EnvironmentVariables {
  @IsNumber()
  APP_VERSION: number;
  // DB
  @IsString()
  DB_HOST: string;
  @IsString()
  DB_PORT: string;
  @IsString()
  DB_USERNAME: string;
  @IsString()
  DB_PASSWORD: string;
  @IsString()
  DB_NAME: string;
  // JWT
  @IsString()
  JWT_SECRET: string;

  //GMAIL
  @IsString()
  MAILER_USER: string;
  @IsString()
  MAILER_PASSWORD: string;

  @IsString()
  AWS_REGION: string;
  @IsString()
  AWS_ACKEY: string;
  @IsString()
  AWS_SKEY: string;

  AWS_S3_BUCKET: string;

  // Eexpo
  EXPO_ACCESS_TOKEN: string;

}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
