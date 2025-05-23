import { VehicleBrand, VehicleColor } from './vehicle.enum';

export class Vehicle {
  id: string;
  plate: string;
  color: VehicleColor;
  brand: VehicleBrand;
}
