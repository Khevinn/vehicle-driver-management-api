import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Usage } from './entities/usage.entity';
import { StartUsageDto } from './dto/start-usage.dto';
import { v4 as uuidv4 } from 'uuid';
import { DriverService } from '../driver/driver.service';
import { VehicleService } from '../vehicle/vehicle.service';

@Injectable()
export class UsagesService {
  private usages: Usage[] = [];

  constructor(
    private readonly vehicleService: VehicleService,
    private readonly driversService: DriverService,
  ) {}

  startVehicleUsage(startUsageDto: StartUsageDto): Usage {
    const vehicle = this.vehicleService.findOne(startUsageDto.vehicleId);
    const driver = this.driversService.findOne(startUsageDto.driverId);

    const vehicleInUse = this.usages.find(
      (u) => u.vehicleId === vehicle.id && !u.endDate,
    );

    if (vehicleInUse) {
      throw new BadRequestException('Vehicle is already in use');
    }

    const driverInUse = this.usages.find(
      (u) => u.driverId === driver.id && !u.endDate,
    );

    if (driverInUse) {
      throw new BadRequestException('Driver is already using a vehicle');
    }

    const usage: Usage = {
      id: uuidv4(),
      vehicleId: startUsageDto.vehicleId,
      driverId: startUsageDto.driverId,
      reason: startUsageDto.reason,
      startDate: new Date(),
    };
    this.usages.push(usage);

    return usage;
  }

  endVehicleUsage(usageId: string): Usage {
    const usage = this.usages.find((u) => u.id === usageId);

    if (!usage) {
      throw new NotFoundException(`Usage with id: ${usageId} not found`);
    }

    if (usage.endDate) {
      throw new BadRequestException(`Usage with id: ${usageId} already ended`);
    }

    usage.endDate = new Date();

    return usage;
  }

  // Caso não encontre o motorista ou a placa do veículo, tratativa de erro para evitar exception e quebra do código
  findAll(): Array<{
    id: string;
    driverName: string;
    brand: string;
    startDate: Date;
    endDate?: Date;
    reason: string;
  }> {
    return this.usages.map((u) => {
      const driver = this.driversService.findOne(u.driverId);
      const vehicle = this.vehicleService.findOne(u.vehicleId);
      return {
        id: u.id,
        driverName: driver?.name ?? 'Unknown Drive',
        brand: vehicle?.brand ?? 'Unknown Vehicle',
        startDate: u.startDate,
        endDate: u.endDate,
        reason: u.reason,
      };
    });
  }
}
