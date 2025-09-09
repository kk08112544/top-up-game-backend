import { Injectable } from '@nestjs/common';
import { Game,Prisma } from '@prisma/client';
import { PrismaService } from "src/prisma.service";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import {Upload} from '@aws-sdk/lib-storage';
import * as dotenv from 'dotenv';

@Injectable()
export class GameService {

  private bucketName: string;
  private s3: S3Client;

  constructor(private prisma:PrismaService) {
    this.bucketName = process.env.AWS_BUCKET_NAME!;
    this.s3 = new S3Client({
      region: process.env.AWS_REGION!,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }

  async create(data: Game):Promise<any> {
    const createGame : Game = await this.prisma.game.create({
      data:{
        ...data,
      }
    })
    return createGame;
  }

  async getAllGame():Promise<any> {
    return this.prisma.game.findMany({
      where:{
        active:true
      }
    });
  }

  async getTopUpGame():Promise<any>{
    return this.prisma.game.findMany({
      where:{
        status_id:{
          not:2
        },
        active:true
      },
    })
  }


  async findGameOne(id: number):Promise<any> {
     return this.prisma.game.findUnique({
      where:{
        id:Number(id)
      }
    });
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

  async updateGame(id: number, data: Game):Promise<Game>  {

    const {game_name, game_profile, description} = data;

    const updateData: Partial<Game>={}
    if(game_name) updateData.game_name = game_name;
    if(game_profile) updateData.game_profile = game_profile;
    if(description)  updateData.description = description;

    if(game_profile){
       try{
         await this.removeOldImage(id);
        
          console.log("Old image removed successfully");
       }catch(error){
         console.error("Failed to remove old image:", error.message);
       }
    }

    try{
      const updated = await this.prisma.game.update({
        where:{id:Number(id)},
        data:updateData,
      })
      return updated;
    }catch(error){
        console.error("Failed to update equipment:", error.message);
        throw error;
    }
  }

  async updateGameStatus(id:number, status_id:number):Promise<any>{
     return this.prisma.game.update({
      where:{id:Number(id)},
      data:{
        status_id:Number(status_id)
      }
     })
  }

  async deleteGame(id: number):Promise<any> {

    await this.removeOldImage(id);

    return this.prisma.game.update({
      where:{
        id:Number(id)
      },
      data:{
        active:false
      }
    })
  }
}
