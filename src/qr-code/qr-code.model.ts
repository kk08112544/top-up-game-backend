import { ApiProperty } from '@nestjs/swagger';

export class QrCode{

    @ApiProperty({ example: '' })
    package_id:number;

    @ApiProperty({ example: '' })
    payment_id:number;


}