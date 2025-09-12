import { Controller, Get, Post, Body, Put, Param, Delete,UseGuards,Res } from '@nestjs/common';
import { PaymentmethodService } from './paymentmethod.service';
import { PaymentMethod } from './paymentmethod.model';
import { ApiTags,ApiBearerAuth } from '@nestjs/swagger';
import { LocalAuthGuard } from "src/token/local/local-auth.guard";
import { JwtAuthGuard } from "src/token/jwt/jwt-auth.guard";
import type {Response} from 'express';

@ApiTags('api/paymentmethod')
@Controller('api/paymentmethod')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class PaymentmethodController {
  constructor(private readonly paymentmethodService: PaymentmethodService) {}

  @Post('createNewPayment')
  async createNewPayment(@Body() postData: PaymentMethod, @Res() res:Response):Promise<any> {

    if(!postData.payment_name || !postData.code || !postData.codePayment || !postData.payment_profile
    ){
      return res.status(400).json({error:'Content is not empty'});
    }
    try{
      const data = await this.paymentmethodService.create(postData);
      return res.status(201).json(data);
    }catch(error){
      return res.status(500).json({error:'Error Creating Payment ', details:error.message})
    }
  }

  @Get()
  async findAllPayment(@Res() res:Response):Promise<any> {
      try{
      const payment = await this.paymentmethodService.getAllPayment();
      return res.status(200).json(payment);
    }catch(error){
      return res.status(500).json({error:'Error message' + error});

    }
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.paymentmethodService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() postData: PaymentMethod, @Res() res:Response):Promise<any> {

     if(!postData.payment_name && !postData.code && !postData.codePayment && !postData.payment_profile && 
      !postData.bankName
    ){
      return res.status(400).json({error:'Content is not empty'});
    }
    try{
        const updatedPayment = await this.paymentmethodService.update(id,postData);
      if(updatedPayment){
        return res.status(201).json(updatedPayment);
      }else{
        return res.status(404).json({error:'This Payment ID ' + id + 'is not found.'});
      }
    }catch(error){

    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentmethodService.remove(+id);
  }
}
