import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';

export const S3ClientProviderToken = 'S3Client';

const S3ClientProvider: Provider = {
  provide: S3ClientProviderToken,
  useFactory: async (config: ConfigService) => {
    const region: string = config.get('AWS_REGION');
    const accessKeyId: string = config.get('AWS_ACKEY');
    const secretAccessKey: string = config.get('AWS_SKEY');
    const bucketEndPoint: string = config.get('BUCKET_ENDPOINT');
    const client = new S3Client({
      endpoint: bucketEndPoint,
      region,
      forcePathStyle: false,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    return client;
  },
  inject: [ConfigService],
};
export default S3ClientProvider;
