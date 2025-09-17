import { Injectable } from '@nestjs/common';
import { QrCode } from './qr-code.model';
import { PrismaService } from 'src/prisma.service';
import { PaymentMethod } from '@prisma/client';
import * as QRCode from 'qrcode';
import promptpay from 'promptpay-qr';


@Injectable()
export class QrCodeService {

   constructor(private prisma:PrismaService){}

  async create(data: QrCode): Promise<any> {

   //   const pkg = await this.prisma.package.findUnique({
   //    where:{id:data.package_id},
   //   });

   //   if(!pkg){
   //    return null
   //   }


   //   const OnePayment = await this.prisma.paymentMethod.findUnique({
   //    where: {id:Number(data.payment_id), active:true}
   //   })
   //   if(!OnePayment){
   //    return null
   //   }

   //   const paymentData = {
   //    package:pkg.package_name,
   //    price:pkg.price,
   //    bankName:OnePayment.bankName,
   //    code:OnePayment.code,
   //    account:OnePayment.codePayment
   //   };

   //   const textData = JSON.stringify(paymentData);

   //   const qrCode = await QRCode.toDataURL(textData);

   //   return {
   //    package:pkg,
   //    paymentMethod:OnePayment,
   //    qrCode,
   //   };
     const pkg = await this.prisma.package.findUnique({
      where: { id: data.package_id },
    });

    if (!pkg) throw new Error('Package not found');

    const OnePayment = await this.prisma.paymentMethod.findUnique({
      where: { id: Number(data.payment_id) },
    });

    if (!OnePayment) throw new Error('Payment method not found');

    // 👇 ใช้ promptpay-qr สร้าง string สำหรับพร้อมเพย์
    const mobileOrTaxId = OnePayment.codePayment; // เบอร์/เลขบัตรปชช/เลขนิติบุคคล
    const amount = pkg.price;

    const payload = promptpay(mobileOrTaxId, { amount });

    // 👇 แปลงเป็น QR Image (base64)
    const qrCode = await QRCode.toDataURL(payload);

    return {
      package: pkg,
      paymentMethod: OnePayment,
      qrCode,
    };
  }
     
  }




