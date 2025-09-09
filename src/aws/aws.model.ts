import { ApiProperty } from '@nestjs/swagger';

export class AWS {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}