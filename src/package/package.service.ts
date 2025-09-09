import { Injectable } from '@nestjs/common';
import { Package } from '@prisma/client';
import { PrismaService } from "src/prisma.service";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import {Upload} from '@aws-sdk/lib-storage';
import * as dotenv from 'dotenv';


@Injectable()
export class PackageService {

  
   private bucketName: string;
  private s3: S3Client;

  constructor(private prisma: PrismaService) {
    this.bucketName = process.env.AWS_BUCKET_NAME!;
    this.s3 = new S3Client({
      region: process.env.AWS_REGION!,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }


  async create(data: Package):Promise<any> {

    const checkGame = await this.prisma.game.findUnique({
      where:{
        id:Number(data.game_id), active:true
      }
    })

    if(checkGame){
         const createPackage : Package = await this.prisma.package.create({
          data:{
              ...data,
          }
         })
         return createPackage;
    }else{
      return null
    }
  }




  async findPackage(game_id: number):Promise<any> {
    return this.prisma.package.findMany({where:{
      game_id:Number(game_id),active:true
    }})
  }


  async findTopUpPackage(game_id:number):Promise<any>{
    return this.prisma.package.findMany({
      where:{
        game_id:Number(game_id),
        numpack:{
          not:0
        },active:true
      }
    })
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

  async updatePackage(id: number, data: Package):Promise<any> {
     const {package_name,package_profile,price,numpack,game_id} = data;

     const updateData: Partial<Package>={}

     if(package_name) updateData.package_name = package_name;
     if(package_profile) updateData.package_profile = package_profile;
     if(price) updateData.price = price;
     if(numpack) updateData.numpack = numpack;
     if(game_id) updateData.game_id = game_id;



     if(package_profile){
      try{
        await this.removeOldImage(id);
        console.log("Old image removed successfully");
      }catch(error){
        console.error("Failed to remove old image: ", error.message);
      }
     }
     try{
       
      const checkActive = await this.prisma.package.findUnique({
        where:{id:Number(id), active:true}
      })

      if(checkActive){
        if(game_id){
          const checkGame = await this.prisma.game.findUnique({
            where:{id:Number(game_id),
              active:true
            }
          })
          if(!checkGame){
            return 'This Game ID is not found'
          }
        }
        const updated = await this.prisma.package.update({
          where:{id:Number(id)},
          data:updateData
        })
        return updated;
      }else{
        return null
      }
      
     }catch(error:any){
      console.error('Failed to update equipment:',error.message);
      throw error;
     }
  }

  async deletePackage(id: number):Promise<any> {
    
    await this.removeOldImage(id);
    return this.prisma.package.update({
      where:{
        id:Number(id)
      },
      data:{
        active:false
      }
    })
  }
}
