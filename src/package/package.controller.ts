import { Controller, Get, Post, Body, Put, Param, Delete,Res,UseGuards } from '@nestjs/common';
import { PackageService } from './package.service';
import { Package } from './package.model';
import type {Response} from 'express';
import { ApiTags,ApiBearerAuth} from '@nestjs/swagger';
import { LocalAuthGuard } from "src/token/local/local-auth.guard";
import { JwtAuthGuard } from "src/token/jwt/jwt-auth.guard";

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@ApiTags('api/package')
@Controller('api/package')
export class PackageController {
  constructor(private readonly packageService: PackageService) {}

  @Post('createNewPackage')
  async create(@Body() postData: Package, @Res() res:Response):Promise<any> {

     if(!postData.package_name || !postData.numpack || !postData.price || !postData.package_profile ||
      !postData.game_id
     ){
      return res.status(400).json({message: 'Content are not empty'});
    }
    try{
      const data = await this.packageService.create(postData);
      return res.status(201).json(data);
    }catch(error){
      return res.status(500).json({error:'Error creating package', details:error.message})
    }
  }

  @Get(':game_id')
  async findPackage(@Param('game_id') game_id: number,@Res() res:Response):Promise<any> {
    try{
      const pack = await this.packageService.findPackage(game_id);
      if(pack){
        return res.status(200).json(pack);
      }else{
        return res.status(404).json({message:'This Game Id ' + game_id + 'is not found'})
      }
    }catch(error){
      return res.status(500).json({error:"Error message"+error})
    }
  }

  @Get('topup/:game_id')
  async findTopUpPackage(@Param('game_id') game_id: number,@Res() res:Response):Promise<any> {
    try{
      const pack = await this.packageService.findTopUpPackage(game_id);
      if(pack){
        return res.status(200).json(pack);
      }else{
        return res.status(404).json({message:'This Game Id ' + game_id + 'is not found'})
      }
    }catch(error){
      return res.status(500).json({error:"Error message"+error})
    }
  }



  @Put('updatePackage/:id')
  async updatePackage(@Param('id') id: number, @Body() postData: Package, @Res() res:Response):Promise<any> {
    if(!postData.package_name && !postData.numpack && !postData.price && !postData.package_profile && !postData.game_id){
      return res.status(400).json({message: 'Content are not empty'});
    }
     try{
      const updatedPackage = await this.packageService.updatePackage(id,postData);
      if(updatedPackage){
        return res.status(201).json(updatedPackage);
      }else{
        return res.status(404).json({error:'This Package ID ' + id + 'is not found.'});
      }
    }catch(error){
      return res.status(500).json({ error: 'Error message' });
    }
  }

  @Delete('deletePackage/:id')
  async deletePackage(@Param('id') id: number , @Res() res:Response):Promise<any>  {
    try{
      const deleteGame = await this.packageService.deletePackage(id);
      if(deleteGame){
        return res.status(200).json({message:'Delete Package Id ' + id + ' is Successfully'});
      }else{
        return res.status(404).json({message:'This Package Id ' + id + 'is not found'});
      }
    }catch(error){
      return res.status(500).json({error:'Error message' + error});
    }
  }
}
