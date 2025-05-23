import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class StartUsageDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  vehicleId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  driverId: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  reason: string;
}
