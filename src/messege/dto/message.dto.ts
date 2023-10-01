import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MessageDto {
  @ApiProperty()
  @IsEmail()
  receiverEmail: string;

  @ApiProperty()
  @IsString()
  message: string;
}
