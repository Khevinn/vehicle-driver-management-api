import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class EndUsageDto {
  @IsUUID()
  @ApiProperty()
  usageId: string;
}
