import { ApiProperty } from '@nestjs/swagger';

export class Transaction{

    id:number;

    @ApiProperty({ example: '' })
    user_id:number;

    @ApiProperty({ example: '' })
    game_id:number;

    @ApiProperty({ example: '' })
    package_id:number;

    @ApiProperty({ example: '' })
    UID:string;

    price:number

    @ApiProperty({ example: '' })
    payment_id:number;

    status_id:number=3;
}