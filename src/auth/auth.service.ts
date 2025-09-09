import { Injectable } from '@nestjs/common';
import {Users,Prisma} from '@prisma/client'
import { PrismaService } from "src/prisma.service";
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import {Upload} from '@aws-sdk/lib-storage';
import * as dotenv from 'dotenv';

@Injectable()
export class AuthService {

  private bucketName: string;
  private s3: S3Client;

  constructor(private prisma: PrismaService, private jwtService: JwtService) {
    this.bucketName = process.env.AWS_BUCKET_NAME!;
    this.s3  = new S3Client({
      region:process.env.AWS_REGION!,
      credentials:{
        accessKeyId:process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
      },
    });
  }


  async create(data:Users):Promise<any> {
    const hashedPassword: string = await bcrypt.hash(data.password,10);
    const createdUser :Users = await this.prisma.users.create({
      data:{
        fname:data.fname,
        lname:data.lname,
        email:data.email,
        password:hashedPassword,
        user_profile:data.user_profile
      },
      include:{
        role:{
          select:{
            role_name:true
          }
        }
      }
    })
    const token = this.jwtService.sign({userId:createdUser.id,email:createdUser.email});
    return {user:createdUser, token};
  }

 

  async validateEmail(email:String):Promise<any> {
    return this.prisma.users.findUnique({
      where:{email:String(email)},
      select:{
        id:true,
        fname:true,
        lname:true,
        email:true,
        user_profile:true,
        role_id:true,
        role:{
          select:{
            role_name:true
          }
        }
      }
    });
    
  }


 async validateUser(email: string, password: string): Promise<any>{
  const user = await this.prisma.users.findUnique({
    where: {email: String(email), active:Boolean(true)},
    include:{
      role:{
        select:{
          role_name:true,
        }
      }
    }
  })

  if(!user){
    return null;
  }
  
  const isMatch = await bcrypt.compare(password, user.password);

  if(isMatch){
    return user;
  }else if (!isMatch){
    return 'Password not matches';
  }
 }

  async login(user:Users):Promise<any>{
     const payload = {email:user.email, sub:user.id};
     const token = this.jwtService.sign(payload);

     return {
      user:{
        ...user,
        token
      }
     };
  }

  async removeOldImage(id:number): Promise<boolean>{
    const user = await this.prisma.users.findUnique({where: {id:Number(id)}});

    if(!user){
      console.error('Record not found.');
    }
    const img_url = user?.user_profile;
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

  async updateProfile(id:number ,data:Partial<Users>):Promise<any>{
    const {fname,lname,email,user_profile} = data;

    const updateData: Partial<Users> = {}

    if(fname) updateData.fname = fname;
    if(lname) updateData.lname = lname;
    if(email) updateData.email = email;
    if(user_profile) updateData.user_profile = user_profile;

    if(user_profile){
      try{
        await this.removeOldImage(id);
        console.log("Old image removed successfully");
      }catch(error){
        console.error("Failed to remove old image:", error.message);
      }
    }

    try{
      const updated = await this.prisma.users.update({
        where:{id:Number(id)},
        data:updateData,
      })
      return updated
    }catch(error){
      console.error("Failed to update profile", error.message);
      return error;
    }
  }

}

