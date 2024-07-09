import { Inject, Injectable } from '@nestjs/common';
import { TRANSPORT_PROVIDER_KEY } from './constants';
import { Transporter, SendMailOptions } from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    @Inject(TRANSPORT_PROVIDER_KEY) private readonly transporter: Transporter,
    private configService: ConfigService,
  ) {}

  async sendMail(mailOptions: SendMailOptions) {
    const options = {
      ...mailOptions,
      from: {
        name: this.configService.get('MAILER_USER'),
        address: this.configService.get('MAILER_USER'),
      },
    };
    return await this.transporter.sendMail(options);
  }
}
