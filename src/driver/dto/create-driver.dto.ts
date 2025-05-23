import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateDriverDto {
  @IsString()
  @MinLength(1)
  @ApiPropertyOptional({ description: 'a' })
  name: string;
}
