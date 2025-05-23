import { NotFoundException } from '@nestjs/common';
import { DriverService } from './driver.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';

describe('DriverService', () => {
  let service: DriverService;

  const mockCreateDriverDto: CreateDriverDto = {
    name: 'Khevin Karlos',
  };

  const mockUpdateDriverDto: UpdateDriverDto = {
    name: 'Ashe Silva',
  };

  beforeEach(() => {
    service = new DriverService();
    // Limpa os dados em memória antes de cada teste
    (service as any).drivers = [];
  });

  describe('create', () => {
    it('should create a driver successfully', () => {
      const result = service.create(mockCreateDriverDto);
      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.name).toEqual(mockCreateDriverDto.name);
      expect(service['drivers']).toHaveLength(1);
    });
  });

  describe('findAll', () => {
    beforeEach(() => {
      service.create(mockCreateDriverDto);
    });

    it('should return all drivers when no filter is provided', () => {
      const result = service.findAll();
      expect(result).toHaveLength(1);
      expect(result[0].name).toEqual(mockCreateDriverDto.name);
    });

    it('should return filtered drivers ignoring case sensitivity', () => {
      const result = service.findAll({ name: 'khevin' });
      expect(result).toHaveLength(1);
      expect(result[0].name).toEqual(mockCreateDriverDto.name);
    });

    it('should return empty array when no drivers match the filter', () => {
      const result = service.findAll({ name: 'NonExistent' });
      expect(result).toHaveLength(0);
    });
  });

  describe('findOne', () => {
    beforeEach(() => {
      service.create(mockCreateDriverDto);
    });

    it('should find a driver by id', () => {
      const createdDriver = service['drivers'][0];
      const result = service.findOne(createdDriver.id);
      expect(result).toEqual(createdDriver);
    });

    it('should throw NotFoundException if driver is not found', () => {
      expect(() => service.findOne('non-existent-id')).toThrowError(
        new NotFoundException(`Driver with id: non-existent-id not found`),
      );
    });
  });

  describe('update', () => {
    beforeEach(() => {
      service.create(mockCreateDriverDto);
    });

    it('should update a driver successfully', () => {
      const createdDriver = service['drivers'][0];
      const result = service.update(createdDriver.id, mockUpdateDriverDto);
      expect(result.name).toEqual(mockUpdateDriverDto.name);
      expect(service['drivers'][0].name).toEqual(mockUpdateDriverDto.name);
    });

    it('should throw NotFoundException if driver is not found', () => {
      expect(() =>
        service.update('non-existent-id', mockUpdateDriverDto),
      ).toThrow(
        new NotFoundException(`Driver with id: non-existent-id not found`),
      );
    });
  });

  describe('remove', () => {
    beforeEach(() => {
      service.create(mockCreateDriverDto);
    });

    it('should remove a driver successfully', () => {
      const createdDriver = service['drivers'][0];
      service.remove(createdDriver.id);
      expect(service['drivers']).toHaveLength(0);
    });

    it('should throw NotFoundException if driver is not found', () => {
      expect(() => service.remove('non-existent-id')).toThrow(
        new NotFoundException(`Driver with id: non-existent-id not found`),
      );
    });
  });
});
