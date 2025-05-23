import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { FilterVehicleDto } from './dto/filter-vehicle.dto';
import { Vehicle } from './entities/vehicle.entity';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Injectable()
export class VehicleService {
  private vehicles: Vehicle[] = [];

  // Como não preciso esperar uma resolução de promise/consulta em banco, optei por não utilizar try catch com logs mais robustos
  // Embora o id seja um identificador único, levei em consideração que não pode haver placas iguais também

  create(createVehicleDto: CreateVehicleDto): Vehicle {
    const plateExists = this.vehicles.some(
      (v) => v.plate === createVehicleDto.plate,
    );

    if (plateExists) {
      throw new BadRequestException(
        `Vehicle with plate "${createVehicleDto.plate}" already exists.`,
      );
    }

    const vehicles: Vehicle = { id: uuidv4(), ...createVehicleDto };
    this.vehicles.push(vehicles);

    return vehicles;
  }

  // Utilizei ENUM para cores e marcas limitadas, simplificando a filtragem e evitando salvar strings que não fazem sentido.
  findAll(filter: FilterVehicleDto = {}): Vehicle[] {
    if (!this.vehicles) {
      throw new Error('Vehicle repository not initialized');
    }

    return this.vehicles.filter((v) => {
      const isColorMatch = !filter.color || v.color === filter.color;
      const isBrandMatch = !filter.brand || v.brand === filter.brand;
      return isColorMatch && isBrandMatch;
    });
  }

  findOne(id: string): Vehicle {
    const vehicle = this.vehicles.find((v) => v.id === id);

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with id: ${id} not found`);
    }

    return vehicle;
  }

  update(id: string, updateVehicleDto: UpdateVehicleDto): Vehicle {
    const vehicle = this.findOne(id);

    // Só verifica a placa se ela estiver presente no DTO
    if (updateVehicleDto.plate && updateVehicleDto.plate !== vehicle.plate) {
      const plateExists = this.vehicles.some(
        (v) => v.id !== id && v.plate === updateVehicleDto.plate,
      );
      if (plateExists) {
        throw new BadRequestException(
          `Vehicle with plate "${updateVehicleDto.plate}" already exists.`,
        );
      }
    }

    Object.assign(vehicle, updateVehicleDto);

    return vehicle;
  }

  remove(id: string): void {
    const index = this.vehicles.findIndex((v) => v.id === id);

    if (index === -1) {
      throw new NotFoundException(`Vehicle with id: ${id} not found`);
    }

    this.vehicles.splice(index, 1);
  }
}
