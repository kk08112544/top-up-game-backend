import { ApiProperty } from '@nestjs/swagger';

export class QrCode{

    id:number;

    @ApiProperty({ example: '' })
    user_id:number;

    @ApiProperty({ example: '' })
    payment_id:number;

    @ApiProperty({ example: '' })
    price: number;  

}