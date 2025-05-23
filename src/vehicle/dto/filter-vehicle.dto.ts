import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { VehicleBrand, VehicleColor } from '../entities/vehicle.enum';

export class FilterVehicleDto {
  @IsOptional()
  @IsEnum(VehicleColor)
  @ApiPropertyOptional()
  color?: VehicleColor;

  @IsOptional()
  @IsEnum(VehicleBrand)
  @ApiPropertyOptional()
  brand?: VehicleBrand;
}
