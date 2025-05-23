import { Module } from '@nestjs/common';
import { VehicleModule } from 'src/vehicle/vehicle.module';
import { DriverModule } from '../driver/driver.module';
import { UsagesController } from './usages.controller';
import { UsagesService } from './usages.service';

@Module({
  imports: [VehicleModule, DriverModule],
  controllers: [UsagesController],
  providers: [UsagesService],
})
export class UsagesModule {}
