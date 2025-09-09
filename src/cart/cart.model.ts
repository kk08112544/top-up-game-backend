import { ApiProperty } from '@nestjs/swagger';

export class Cart{

    id:number;

    @ApiProperty({ example: '' })
    user_id:number;

    @ApiProperty({ example: '' })
    UID:string;

    @ApiProperty({ example: '' })
    game_id:number;

    @ApiProperty({ example: '' })
    package_id:number;
}