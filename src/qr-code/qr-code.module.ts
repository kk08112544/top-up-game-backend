import { Module } from '@nestjs/common';
import { QrCodeService } from './qr-code.service';
import { QrCodeController } from './qr-code.controller';
import { PrismaService } from 'src/prisma.service';


@Module({
  controllers: [QrCodeController],
  providers: [QrCodeService,PrismaService],
})
export class QrCodeModule {}
