import { Injectable } from '@nestjs/common';
import { QrCode } from './qr-code.model';
import { PrismaService } from 'src/prisma.service';
import { PaymentMethod } from '@prisma/client';

@Injectable()
export class QrCodeService {

   constructor(private prisma:PrismaService){}

  async create(data: QrCode): Promise<any> {
     const OnePayment = await this.prisma.paymentMethod.findUnique({
      where: {id:Number(data.payment_id)}
     })
     
     
  }



}
