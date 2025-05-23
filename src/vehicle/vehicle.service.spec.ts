import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { VehicleBrand, VehicleColor } from './entities/vehicle.enum';
import { VehicleService } from './vehicle.service';

describe('VehicleService', () => {
  let service: VehicleService;

  beforeEach(() => {
    service = new VehicleService();
    // Limpa os dados em memória antes de cada teste
    (service as any).vehicles = [];
  });

  describe('create', () => {
    it('should create a vehicle', () => {
      const dto: CreateVehicleDto = {
        plate: 'ABC1234',
        brand: VehicleBrand.Mercedes,
        color: VehicleColor.Black,
      };

      const result = service.create(dto);

      expect(result).toHaveProperty('id');
      expect(result.plate).toBe(dto.plate);
      expect((service as any).vehicles).toHaveLength(1);
    });

    it('should throw if plate already exists', () => {
      const dto = {
        plate: 'ABC1234',
        brand: VehicleBrand.Honda,
        color: VehicleColor.Gray,
      };
      service.create(dto);

      expect(() => service.create(dto)).toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return all vehicles without filter', () => {
      service.create({
        plate: 'A',
        brand: VehicleBrand.Toyota,
        color: VehicleColor.White,
      });
      service.create({
        plate: 'B',
        brand: VehicleBrand.Chevrolet,
        color: VehicleColor.Black,
      });

      const result = service.findAll({});
      expect(result).toHaveLength(2);
    });

    it('should filter by color and brand', () => {
      service.create({
        plate: 'C',
        brand: VehicleBrand.Volkswagen,
        color: VehicleColor.Green,
      });
      service.create({
        plate: 'D',
        brand: VehicleBrand.Fiat,
        color: VehicleColor.Silver,
      });

      const result = service.findAll({
        brand: VehicleBrand.Volkswagen,
        color: VehicleColor.Green,
      });
      expect(result).toHaveLength(1);
      expect(result[0].color).toBe(VehicleColor.Green);
    });
  });

  describe('findOne', () => {
    it('should return vehicle by id', () => {
      const created = service.create({
        plate: 'DEF456',
        brand: VehicleBrand.Hyundai,
        color: VehicleColor.Blue,
      });

      const result = service.findOne(created.id);
      expect(result).toEqual(created);
    });

    it('should throw if vehicle not found', () => {
      expect(() => service.findOne('invalid-id')).toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a vehicle', () => {
      const created = service.create({
        plate: 'GHI789',
        brand: VehicleBrand.Fiat,
        color: VehicleColor.Silver,
      });

      const updateDto: UpdateVehicleDto = {
        brand: VehicleBrand.Chevrolet,
        color: VehicleColor.Yellow,
      };

      const updated = service.update(created.id, updateDto);
      expect(updated.brand).toBe(VehicleBrand.Chevrolet);
      expect(updated.color).toBe(VehicleColor.Yellow);
    });

    it('should throw if new plate already exists', () => {
      const v1 = service.create({
        plate: 'AAA111',
        brand: VehicleBrand.Fiat,
        color: VehicleColor.Black,
      });

      const v2 = service.create({
        plate: 'BBB222',
        brand: VehicleBrand.Audi,
        color: VehicleColor.Red,
      });

      expect(() => service.update(v2.id, { plate: v1.plate })).toThrow(
        BadRequestException,
      );
    });

    it('should throw if vehicle not found', () => {
      expect(() =>
        service.update('nonexistent', { brand: VehicleBrand.Audi }),
      ).toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a vehicle by id', () => {
      const created = service.create({
        plate: 'JKL012',
        brand: VehicleBrand.BMW,
        color: VehicleColor.Green,
      });

      service.remove(created.id);
      expect((service as any).vehicles).toHaveLength(0);
    });

    it('should throw if vehicle not found', () => {
      expect(() => service.remove('invalid')).toThrow(NotFoundException);
    });
  });
});
