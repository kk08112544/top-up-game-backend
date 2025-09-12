import { ApiProperty } from '@nestjs/swagger';

export class PaymentMethod{

    id:number;

    @ApiProperty({ example: '' })
    payment_name:string;

    @ApiProperty({ example: '' })
    code:string;

    @ApiProperty({ example: '' })
    codePayment:string;

    @ApiProperty({ example: '' })
    bankName:string | null;

    @ApiProperty({ example: '' })
    payment_profile:string

    active:boolean=true
    
}
