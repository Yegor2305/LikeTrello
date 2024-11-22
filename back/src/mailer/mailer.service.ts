import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailerService {
  private readonly transporter: nodemailer.Transporter

  constructor(
    private readonly configService: ConfigService,
  ) {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.ukr.net',
      port: 465,
      secure: true,
      auth: {
        user: configService.get<string>('EMAIL'),
        pass: configService.get<string>('EMAIL_PASSWORD'),
      }
    });
  }

  async sendEmail(to: string, subject: string, html: string){
    await this.transporter.sendMail({
      from: '"No Reply" <yegor2305@ukr.net>',
      to: to,
      subject: subject,
      html: html
    })
  }
}
