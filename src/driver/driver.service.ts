import { Injectable, NotFoundException } from '@nestjs/common';
import { Driver } from './entities/driver.entity';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { v4 as uuidv4 } from 'uuid';
import { FilterDriverDto } from './dto/filter-driver.dto';

@Injectable()
export class DriverService {
  private drivers: Driver[] = [];

  create(createDriverDto: CreateDriverDto): Driver {
    const driver: Driver = { id: uuidv4(), ...createDriverDto };
    this.drivers.push(driver);

    return driver;
  }

  // Ignorar o case sensitive da busca e do resultado
  findAll(filter?: FilterDriverDto): Driver[] {
    if (!filter?.name) {
      return this.drivers;
    }

    return this.drivers.filter((d) =>
      d.name.toLowerCase().includes(filter.name.toLowerCase()),
    );
  }

  findOne(id: string): Driver {
    const driver = this.drivers.find((d) => d.id === id);

    if (!driver) {
      throw new NotFoundException(`Driver with id: ${id} not found`);
    }

    return driver;
  }

  update(id: string, updateDriverDto: UpdateDriverDto): Driver {
    const driver = this.findOne(id);
    Object.assign(driver, updateDriverDto);

    return driver;
  }

  remove(id: string): void {
    const index = this.drivers.findIndex((d) => d.id === id);

    if (index === -1) {
      throw new NotFoundException(`Driver with id: ${id} not found`);
    }

    this.drivers.splice(index, 1);
  }
}
