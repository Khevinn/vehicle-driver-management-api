import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FilterDriverDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  name?: string;
}
