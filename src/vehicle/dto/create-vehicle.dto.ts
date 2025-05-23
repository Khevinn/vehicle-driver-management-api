import { IsEnum, IsString, Length } from 'class-validator';
import { VehicleBrand, VehicleColor } from '../entities/vehicle.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVehicleDto {
  @IsString()
  @Length(1, 10)
  @ApiProperty({ example: 'ABC1234' })
  plate: string;

  @IsEnum(VehicleColor)
  @ApiProperty({
    enum: VehicleColor,
  })
  color: VehicleColor;

  @IsEnum(VehicleBrand)
  @ApiProperty({ enum: VehicleBrand })
  brand: VehicleBrand;
}
