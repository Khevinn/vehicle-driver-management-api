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
      (usage) => usage.vehicleId === vehicle.id && !usage.endDate,
    );

    if (vehicleInUse) {
      throw new BadRequestException('Vehicle is already in use');
    }

    const driverInUse = this.usages.find(
      (usage) => usage.driverId === driver.id && !usage.endDate,
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
    const usage = this.usages.find((usage) => usage.id === usageId);

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
    return this.usages.map((usage) => {
      const driver = this.driversService.findOne(usage.driverId);
      const vehicle = this.vehicleService.findOne(usage.vehicleId);
      return {
        id: usage.id,
        driverName: driver?.name ?? 'Unknown Drive',
        brand: vehicle?.brand ?? 'Unknown Vehicle',
        startDate: usage.startDate,
        endDate: usage.endDate,
        reason: usage.reason,
      };
    });
  }
}
