import { ApiProperty } from '@nestjs/swagger';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {IsEmail, Matches } from 'class-validator';


export class Users{
    id:number;

    @ApiProperty({ example: '' })
    fname: string;

    @ApiProperty({ example: '' })
    lname: string;

    @ApiProperty({ example: '' })
    @IsEmail()
    @Matches(/@gmail\.com$/, { message: 'Email must end with @gmail.com' })
    email: string;

     @ApiProperty({ example: '' })
    @Matches(/^[0-9a-zA-Z@#$%!#]+$/, {
     message: 'Password can only contain 0-9, a-z, A-Z and @ # $ % ! #',
    })
    password: string;

     @ApiProperty({ example: '' })
    cpassword: string;
    
    @ApiProperty({ example: '' })
    user_profile: string;

    role_id:number=2

    active:boolean=true
    
}


export class Login{
     @ApiProperty({ example: '' })
    email: string;
     @ApiProperty({ example: '' })
    password: string;
}