import { Controller, Get, Post, Body, Put, Param, Delete,Res, UseGuards } from '@nestjs/common';
import { GameService } from './game.service';
import { LocalAuthGuard } from "src/token/local/local-auth.guard";
import { JwtAuthGuard } from "src/token/jwt/jwt-auth.guard";
import { ApiTags,ApiBearerAuth } from '@nestjs/swagger';
import {Game} from './game.model'
import type {Response} from 'express';

@ApiTags('api/game')
@Controller('api/game')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post('createNewGame')
  async create(@Body() postData: Game, @Res() res:Response):Promise<any> {
    if(!postData.game_name || !postData.game_profile || !postData.description){
      return res.status(400).json({message: 'Content are not empty'});
    }
    try{
      const data = await this.gameService.create(postData);
      return res.status(201).json(data);
    }catch(error){
      return res.status(500).json({error:'Error creating game', details:error.message})
    }
  }

  @Get()
  async getAllGame(@Res() res:Response):Promise<any> {
    try{
      const game = await this.gameService.getAllGame();
      return res.status(200).json(game);
    }catch(error){
      return res.status(500).json({error:'Error message' + error});

    }
  }

  @Get('topup')
  async getTopUpGame(@Res() res:Response):Promise<any> {
    try{
      const topupgame = await this.gameService.getTopUpGame();
      return res.status(200).json(topupgame);
    }catch(error){
      return res.status(500).json({error:'Error message' + error});

    }
  }

  @Get('/:id')
  async findGameOne(@Param('id') id: number, @Res() res:Response):Promise<any> {
    try{
      const game = await this.gameService.findGameOne(id);
      if(game){
        return res.status(200).json(game);
      }else{
        return res.status(404).json({message:'This Game ' + id + 'is not found.'});
      }
    }catch(error){
      return res.status(500).json({error:'Error message' + error});
    }
  }

  @Put('updateGame/:id')
  async updateGame(@Param('id') id: number, @Body() postData:Game, @Res() res:Response):Promise<any> {
    if(!postData.game_name && !postData.game_profile && !postData.description){
      return res.status(400).send({error:'Content is not empty'});
    }
    try{
      const updatedGame = await this.gameService.updateGame(id,postData);
      if(updatedGame){
        return res.status(201).json(updatedGame);
      }else{
        return res.status(404).json({error:'This Game ID ' + id + 'is not found.'});
      }
    }catch(error){
      return res.status(500).json({ error: 'Error message' });
    }
  }

    @Put('updateGameStatus/:id')
  async updateGameStatus(@Param('id') id: number, @Body() status_id:number, @Res() res:Response):Promise<any> {
    if(!status_id){
      return res.status(400).send({error:'Content is not empty'});
    }
    try{
      const updateGame = await this.gameService.updateGameStatus(id,status_id);
      if(updateGame){
        return res.status(201).json(updateGame);
      }else{
        return res.status(404).json({error:'This Game ID ' + id + 'is not found.'});
      }
    }catch(error){
      return res.status(500).json({ error: 'Error message' });
    }
  }

  @Delete('deleteGame/:id')
  async deleteGame(@Param('id') id: number, @Res() res:Response):Promise<any> {
    try{
      const deleteGame = await this.gameService.deleteGame(id);
      if(deleteGame){
        return res.status(200).json({message:'Delete Game Id ' + id + ' is Successfully'});
      }else{
        return res.status(404).json({message:'This Game Id ' + id + 'is not found'});
      }
    }catch(error){
      return res.status(500).json({error:'Error message' + error});
    }
  }
}
