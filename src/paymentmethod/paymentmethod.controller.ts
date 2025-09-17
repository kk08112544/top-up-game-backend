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
  async findOne(@Param('id') id: number , @Res() res:Response):Promise<any>  {
    try{
      const paymentMethod = await this.paymentmethodService.findOne(id);
      if(paymentMethod){
        return res.status(200).json(paymentMethod);
      }else{
        return res.status(404).json({message:'This PaymentMethod Id ' + id + 'is not found'})
      }
    }catch(error){
      return res.status(500).json({error:"Error message"+error})
    }
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
      return res.status(500).json({error:"Error message"+error})
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number,@Res() res:Response):Promise<any>  {
       try{
      const deleteGame = await this.paymentmethodService.deletePaymentMethod(id);
      if(deleteGame){
        return res.status(200).json({message:'Delete Payment Method Id ' + id + ' is Successfully'});
      }else{
        return res.status(404).json({message:'This Payment Method Id ' + id + 'is not found'});
      }
    }catch(error){
      return res.status(500).json({error:'Error message' + error});
    }
  }
}
