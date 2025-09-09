import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards, Res } from '@nestjs/common';
import { CartService } from './cart.service';
import { Cart } from './cart.model';
import { ApiTags,ApiBearerAuth } from '@nestjs/swagger';
import { LocalAuthGuard } from "src/token/local/local-auth.guard";
import { JwtAuthGuard } from "src/token/jwt/jwt-auth.guard";
import type {Response} from 'express';

@ApiTags('api/cart')
@Controller('api/cart')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('createNewCart')
  async create(@Body() postData: Cart, @Res() res:Response):Promise<any> {
    if(!postData.user_id || !postData.UID || !postData.game_id || !postData.package_id){
      return res.status(400).send({message:'Content is not empty'});
    }
    try{
      const data = await this.cartService.create(postData);
      if(data === null){
        return res.status(404).json({message:"Cannot TopUp this Package"});
      }else if(typeof data==='string' ){
        return res.status(404).json({message:"Game and Package are not found."});
      }
      return res.status(201).json(data);
    }catch(error){
      return res.status(500).json({error:'Error creating cart', details:error.message})
    }
  }

  @Get()
  findAll() {
    return this.cartService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCartDto: Cart) {
    return this.cartService.update(+id, updateCartDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartService.remove(+id);
  }
}
