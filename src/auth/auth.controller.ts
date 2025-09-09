import { Controller, Get, Post, Body, Put, Param, Delete, Res, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import type {Response} from 'express';
import {Users} from './auth.model'
import { Login } from './auth.model';
import { LocalAuthGuard } from "src/token/local/local-auth.guard";
import { JwtAuthGuard } from "src/token/jwt/jwt-auth.guard";
import { ApiTags,ApiBearerAuth } from '@nestjs/swagger';


@ApiTags('api/auth')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  @Post('signup')
  async create(@Body() postData:Users, @Res() res:Response):Promise<any> {
    if(!postData.fname || !postData.lname || !postData.email || 
      !postData.password || !postData.cpassword || !postData.user_profile){
      return res.status(400).json({message: 'Content are not empty'});
    }

    try{
      if(postData.password === postData.cpassword){
        const data = await this.authService.create(postData);
        return res.status(201).json(data);
      }else{
        return res.send({message:'Password does not matches'});
      }
    }catch(error){
      return res.status(500).json({error:'Error creating user', details:error.message})
    }
  }


  @Get(':email')
  async ValidateEmail(@Param('email') email: string, @Res() res:Response):Promise<any>{
    if(!email){
      return res.status(400).json({message:'Email is required'});
    }
    try{
      const checkMail = await this.authService.validateEmail(email);
      if(checkMail){
        return res.status(200).json(checkMail);
      }else{
        return res.status(404).json({message:'Not Found this email'});
      }
    }catch(error){
      return res.status(500).json({message:'Error message',error:error.message});
    }
  }

  @Post('login')
  async login(@Body() postData:Login, @Res() res:Response):Promise<any>{
    if(!postData.email || !postData.password){
      return res.status(400).send({message:'Email and Password are required'});
    }
    try{
      const user = await this.authService.validateUser(postData.email ,postData.password);
      if(user === null){
        return res.status(401).json({message:'Invalid Email OR Active is False'});
      }
      if(typeof user === 'string'){
        return res.status(401).json({message:'Invalid Password'});
      }
      const loginResult = await this.authService.login(user);
      return res.status(200).json(loginResult);
    }catch(error){
      return res.status(500).json({message:'Error message',error:error.message});
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Put('updateProfile/:id')
  async updateProfile(@Param('id') id:number, @Body() postData:Users, @Res() res:Response):Promise<any>{
    if(!postData.fname && !postData.lname && !postData.email && !postData.user_profile){
      return res.status(400).json({error:'Content is not empty'});
    }

    try{
      const updateProfile = await this.authService.updateProfile(id, postData);
      if(updateProfile){
        return res.status(201).json(updateProfile);
      }else{
        return res.status(404).json({error:'This User Id ' + id + 'is not found.'});
      }
    }catch(error){
      return res.status(500).json({error:'Error message' + error});
    }
  }

  

}
