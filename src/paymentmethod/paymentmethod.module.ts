import { Module } from '@nestjs/common';
import { PaymentmethodService } from './paymentmethod.service';
import { PaymentmethodController } from './paymentmethod.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [PaymentmethodController],
  providers: [PaymentmethodService,PrismaService],
})
export class PaymentmethodModule {}
