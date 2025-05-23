import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DriverModule } from './driver/driver.module';
import { UsagesModule } from './usages/usages.module';
import { VehicleModule } from './vehicle/vehicle.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DriverModule,
    UsagesModule,
    VehicleModule,
  ],
})
export class AppModule {}
