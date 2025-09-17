import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import {Upload} from '@aws-sdk/lib-storage'
import * as dotenv from 'dotenv'
import * as multer from 'multer';
import type { Express } from 'express';

dotenv.config();

@Injectable()
export class AwsService {

  private readonly s3:S3Client;
  private readonly bucketName:string;

  constructor(){
    this.bucketName = process.env.AWS_BUCKET_NAME!;
    this.s3 = new S3Client({
      region:process.env.AWS_REGION!,
      credentials:{
        accessKeyId:process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
      },
    });
  }

  async UploadedFile(file: Express.Multer.File) {
    try{
     const extArray = file.mimetype.split("/");
     const extension = extArray[extArray.length-1];
      

     const key = `Fileupload-${Date.now()}.${extension}`;

     const upload = new Upload({
      client: this.s3,
      params:{
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype
      }
     });
     
     await upload.done();

     return {
      status: 201,
      message: 'Uploaded Success',
      url:`https://s3.${process.env.AWS_REGION}.amazonaws.com/${this.bucketName}/${key}`
     }
      
    }catch(error){
      console.error('Uploaded Failed',error);
      return {
        status: 500,
        message:'Uploaded Failed',
        error: error
      }
    }
  }
}
