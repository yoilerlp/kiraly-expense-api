/* eslint-disable @typescript-eslint/no-var-requires */
import { DynamicModule, FactoryProvider, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import type SMTPTransport from 'nodemailer/lib/smtp-transport';

import { MAILER_HOST, MAILER_PORT, TRANSPORT_PROVIDER_KEY } from './constants';
import { MailService } from './mail.service';
import type { Transporter } from 'nodemailer';
const nodemailer = require('nodemailer');

@Module({})
export class MailModule {
  static async registerAsync(): Promise<DynamicModule> {
    const transportProvider: FactoryProvider<
      Transporter<SMTPTransport.SentMessageInfo>
    > = {
      useFactory: (configService: ConfigService) => {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          host: MAILER_HOST,
          port: MAILER_PORT,
          secure: false,
          auth: {
            user: configService.get('MAILER_USER'),
            pass: configService.get('MAILER_PASSWORD'),
          },
        });

        return transporter;
      },
      inject: [ConfigService],
      provide: TRANSPORT_PROVIDER_KEY,
    };

    return {
      module: MailModule,
      providers: [MailService, transportProvider],
      exports: [MailService, transportProvider],
      global: true,
    };
  }
}
