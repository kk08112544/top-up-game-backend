import { Controller, Get, Post, Body, Patch, Param, Delete,UseInterceptors, Res,UploadedFile } from '@nestjs/common';
import { AwsService } from './aws.service';
import { FileInterceptor } from '@nestjs/platform-express';
import type {Response } from 'express';
import { ApiTags,  ApiConsumes, ApiBody } from '@nestjs/swagger';
import { AWS } from './aws.model';
import * as multer from 'multer';

@ApiTags('api/aws')
@Controller('api/aws')
export class AwsController {
  constructor(private readonly awsService: AwsService) {}

  @Post('upload')
   @ApiConsumes('multipart/form-data') // บอก Swagger ว่า endpoint รับไฟล์
  @ApiBody({ type: AWS })
  @UseInterceptors(FileInterceptor('file', { storage: multer.memoryStorage() }))
  async create(@UploadedFile() file: Express.Multer.File, @Res() res:Response):Promise<any> {
    if(!file){
      return res.status(400).json({message:'No file uploaded'});
    }

    const result = await this.awsService.UploadedFile(file);

    if(result.status === 201){
      return res.status(201).json(result);
    }else{
      return res.status(500).json(result);
    }
  }

}
