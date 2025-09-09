import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, isNotEmpty, IsNumber } from 'class-validator';

export class Package{
    id:number;

    @ApiProperty({ example: '' })
    package_name:string;

    @ApiProperty({ example: '' })
    numpack:number;

    @ApiProperty({ example: '' })
    price:number;

    @ApiProperty({ example: '' })
    package_profile:string;

    @ApiProperty({ example: '' })
    game_id:number

    
    active:boolean=true
}