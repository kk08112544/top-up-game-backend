import { ApiProperty } from '@nestjs/swagger';


export class Game{

     id:number;

     @ApiProperty({ example: '' })
     game_name:string;

     @ApiProperty({ example: '' })
    game_profile:string;

     @ApiProperty({ example: '' })
    status_id:number;

     @ApiProperty({ example: '' })
    description:string;
}