import { Controller, Get, Post, Body, Put, Param,UseGuards,Res } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { LocalAuthGuard } from "src/token/local/local-auth.guard";
import { JwtAuthGuard } from "src/token/jwt/jwt-auth.guard";
import { ApiTags,ApiBearerAuth } from '@nestjs/swagger';
import { Transaction } from './transaction.model';
import type { Response } from 'express';

@ApiTags('api/transaction')
@Controller('api/transaction')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('createNewTransaction')
  async createNewTransaction(@Body() postData: Transaction, @Res() res:Response):Promise<any> {


    if( !postData.user_id || !postData.game_id || !postData.package_id ||
      !postData.UID || !postData.payment_id || !postData.price
    ){
      return res.status(400).json({error:'Content is not empty'});
    }
  
    try{
      const data = await this.transactionService.createNewTransaction(postData);
      return res.status(201).json(data);
    }catch(error){
      return res.status(500).json({error:'Error Creating Transaction', details:error.message})
    }
  }


  @Get('NewTransaction')
  async findNewTransaction(@Res() res:Response):Promise<any> {
    try{
      const transaction = await this.transactionService.getNewTransaction();
      return res.status(200).json(transaction);
    }catch(error){
      return res.status(500).json({error:'Error message' + error});

    }
  }

    @Get('TransactionManage')
  async findManageTransaction(@Res() res:Response):Promise<any> {
    try{
      const transaction = await this.transactionService.getManageTransaction();
      return res.status(200).json(transaction);
    }catch(error){
      return res.status(500).json({error:'Error message' + error});
    }
  }

  @Get('TotalTopUp')
  async TotalTopUp(@Res() res:Response):Promise<any>{
       try{
      const totalTopUp = await this.transactionService.getTotalTopUp();
      return res.status(200).json(totalTopUp);
    }catch(error){
      return res.status(500).json({error:'Error message' + error});
    }
  }

    @Get('TotalTopUpToday')
  async TotalTopUpToday(@Res() res:Response):Promise<any>{
       try{
      const totalTopUpToday = await this.transactionService.getTotalTopUpToday();
      return res.status(200).json(totalTopUpToday);
    }catch(error){
      return res.status(500).json({error:'Error message' + error});
    }
  }

   @Post('SearchTransaction')
  async findStatusTransaction(@Body('status_id') status_id: number,@Res() res:Response):Promise<any> {
    if(![3,4,5].includes(Number(status_id))){
      return res.status(400).json({message:'Status Id only 3,4,5'});
    }
    try{
      const transaction = await this.transactionService.getStatusTransaction(status_id);
      return res.status(200).json(transaction);
    }catch(error){
      return res.status(500).json({error:'Error message' + error});

    }
  }


  
  @Get('transactionHistory/:user_id')
  async findMyTransaction(@Param('user_id') user_id: number,@Res() res:Response):Promise<any> {
     try{
      const MyTransaction = await this.transactionService.findMyTransaction(user_id);
      if(MyTransaction){
        return res.status(200).json(MyTransaction);
      }else{
        return res.status(404).json({message:'This User Id Transaction ' + user_id + 'is not found.'});
      }
    }catch(error){
      return res.status(500).json({error:'Error message' + error});
    }
  }

  @Put('updateStatusTransaction/:id')
  async update(@Param('id') id: number, @Body() status_id: number, @Res() res:Response):Promise<any> {
    if(![4,5].includes(Number(status_id)) || !status_id){
      return res.status(400).json({message:'Status Id only 3,4,5'});
    }
    try{
      const updateTransaction = await this.transactionService.updateTransactionStatus(id,status_id);
      if(updateTransaction){
        return res.status(201).json(updateTransaction);
      }else{
        return res.status(404).json({message:'This Transaction ID ' + id + 'is not found.'});
      }
    }catch(error){
      return res.status(500).json({ error: 'Error message' });
    }
  }


}
