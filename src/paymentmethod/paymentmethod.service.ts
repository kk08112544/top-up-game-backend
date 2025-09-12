import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import {Upload} from '@aws-sdk/lib-storage';
import { PrismaService } from 'src/prisma.service';
import { PaymentMethod } from '@prisma/client';

@Injectable()
export class PaymentmethodService {

  private bucketName: string;
  private s3: S3Client;


   constructor(private prisma:PrismaService){
      this.bucketName = process.env.AWS_BUCKET_NAME!;
        this.s3 = new S3Client({
          region: process.env.AWS_REGION!,
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
          },
        });
   }

  async create(data: PaymentMethod):Promise<any> {
    
    const createPayment: PaymentMethod = await this.prisma.paymentMethod.create({
       data:{
        ...data,
       }
    })

    return createPayment;
  }

  async getAllPayment():Promise<any>  {
     return this.prisma.game.findMany({
      where:{
        active:true
      }
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} paymentmethod`;
  }

    async removeOldImage(id:number): Promise<boolean>{
    const game = await this.prisma.game.findUnique({where: {id:Number(id)}});

    if(!game){
      console.error('Record not found.');
    }
    const img_url = game?.game_profile;
    if(!img_url) return false;

    const urlParts = img_url.split('/');
    const key = urlParts.slice(4).join('/');

    console.log('S3 Key to delete : ',key);

    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key:key,
    });

    await this.s3.send(command);

    return true

  }


  async update(id: number, data: PaymentMethod):Promise<PaymentMethod> {
    const {payment_name,payment_profile,code,codePayment,bankName}=data;

     const updateData: Partial<PaymentMethod>={}
     if(payment_name) updateData.payment_name = payment_name;
    if(payment_profile) updateData.payment_profile = payment_profile;
    if(code)  updateData.code = code;
    if(codePayment)  updateData.codePayment = codePayment;
    if(bankName) updateData.bankName = bankName;

    if(payment_profile){
       try{
         await this.removeOldImage(id);
        
          console.log("Old image removed successfully");
       }catch(error){
         console.error("Failed to remove old image:", error.message);
       }
    }

    try{
      const updated = await this.prisma.paymentMethod.update({
        where:{id:Number(id)},
        data:updateData,
      })
      return updated;
    }catch(error){
        console.error("Failed to update equipment:", error.message);
        throw error;
    }
  }

  remove(id: number) {
    return `This action removes a #${id} paymentmethod`;
  }
}
