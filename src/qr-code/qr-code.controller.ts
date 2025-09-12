import { Controller, Get, Post, Body, Put, Param, Delete,UseGuards,Res } from '@nestjs/common';
import { QrCodeService } from './qr-code.service';
import { QrCode } from './qr-code.model';
import { ApiTags,ApiBearerAuth } from '@nestjs/swagger';
import { LocalAuthGuard } from "src/token/local/local-auth.guard";
import { JwtAuthGuard } from "src/token/jwt/jwt-auth.guard";
import type {Response} from 'express';




@ApiTags('api/qr-code')
@Controller('api/qr-code')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class QrCodeController {
  constructor(private readonly qrCodeService: QrCodeService) {}

  @Post('createNewQrCode')
  async createNewQrCode(@Body() postData: QrCode, @Res() res:Response):Promise<any> {
    
    if(!postData.user_id ||  !postData.payment_id || !postData.price
    ){
      return res.status(400).json({error:'Content is not empty'});
    }
     try{
      const data = await this.qrCodeService.create(postData);
      return res.status(201).json(data);
    }catch(error){
      return res.status(500).json({error:'Error Creating Qr Code', details:error.message})
    }
  }
}
