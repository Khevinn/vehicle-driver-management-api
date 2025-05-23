import { UsagesService } from './usages.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { DriverService } from '../driver/driver.service';
import { VehicleService } from '../vehicle/vehicle.service';

describe('UsagesService', () => {
  let service: UsagesService;
  let vehicleService: VehicleService;
  let driverService: DriverService;

  const mockVehicle = { id: 'vehicle1', brand: 'Toyota' };
  const mockDriver = { id: 'driver1', name: 'John Doe' };

  beforeEach(() => {
    vehicleService = {
      findOne: jest.fn().mockReturnValue(mockVehicle),
    } as any;

    driverService = {
      findOne: jest.fn().mockReturnValue(mockDriver),
    } as any;

    service = new UsagesService(vehicleService, driverService);
  });

  describe('startVehicleUsage', () => {
    it('should create a usage successfully', () => {
      const dto = {
        vehicleId: 'vehicle1',
        driverId: 'driver1',
        reason: 'Business',
      };

      const usage = service.startVehicleUsage(dto);

      expect(usage).toHaveProperty('id');
      expect(usage.vehicleId).toBe(dto.vehicleId);
      expect(usage.driverId).toBe(dto.driverId);
      expect(usage.reason).toBe(dto.reason);
      expect(usage.startDate).toBeInstanceOf(Date);
    });

    it('should throw if vehicle is already in use', () => {
      const dto = {
        vehicleId: 'vehicle1',
        driverId: 'driver1',
        reason: 'Business',
      };

      service.startVehicleUsage(dto);

      expect(() => service.startVehicleUsage(dto)).toThrow(BadRequestException);
      expect(() => service.startVehicleUsage(dto)).toThrow(
        'Vehicle is already in use',
      );
    });

    it('should throw if driver is already using a vehicle', () => {
      const dto1 = {
        vehicleId: 'vehicle1',
        driverId: 'driver1',
        reason: 'Business',
      };

      const dto2 = {
        vehicleId: 'vehicle2',
        driverId: 'driver1',
        reason: 'Another reason',
      };

      (vehicleService.findOne as jest.Mock).mockImplementation((id: string) =>
        id === 'vehicle1' ? mockVehicle : { id: 'vehicle2', brand: 'Honda' },
      );

      service.startVehicleUsage(dto1);

      expect(() => service.startVehicleUsage(dto2)).toThrow(
        BadRequestException,
      );
      expect(() => service.startVehicleUsage(dto2)).toThrow(
        'Driver is already using a vehicle',
      );
    });
  });

  describe('endVehicleUsage', () => {
    it('should end a usage successfully', () => {
      const dto = {
        vehicleId: 'vehicle1',
        driverId: 'driver1',
        reason: 'Business',
      };

      const usage = service.startVehicleUsage(dto);

      const endedUsage = service.endVehicleUsage(usage.id);

      expect(endedUsage.endDate).toBeInstanceOf(Date);
    });

    it('should throw if usage id not found', () => {
      expect(() => service.endVehicleUsage('nonexistent-id')).toThrow(
        NotFoundException,
      );
      expect(() => service.endVehicleUsage('nonexistent-id')).toThrow(
        'Usage with id: nonexistent-id not found',
      );
    });

    it('should throw if usage already ended', () => {
      const dto = {
        vehicleId: 'vehicle1',
        driverId: 'driver1',
        reason: 'Business',
      };

      const usage = service.startVehicleUsage(dto);
      service.endVehicleUsage(usage.id);

      expect(() => service.endVehicleUsage(usage.id)).toThrow(
        BadRequestException,
      );
      expect(() => service.endVehicleUsage(usage.id)).toThrow(
        `Usage with id: ${usage.id} already ended`,
      );
    });
  });

  describe('findAll', () => {
    it('should list usages with driver name and vehicle brand', () => {
      const dto = {
        vehicleId: 'vehicle1',
        driverId: 'driver1',
        reason: 'Business',
      };

      const usage = service.startVehicleUsage(dto);

      const allUsages = service.findAll();

      expect(allUsages.length).toBe(1);
      expect(allUsages[0]).toMatchObject({
        id: usage.id,
        driverName: mockDriver.name,
        brand: mockVehicle.brand,
        startDate: usage.startDate,
        endDate: undefined,
        reason: usage.reason,
      });
    });

    it('should show "Unknown Drive" and "Unknown Vehicle" if driver or vehicle not found', () => {
      (driverService.findOne as jest.Mock).mockReturnValue(undefined);
      (vehicleService.findOne as jest.Mock).mockReturnValue(undefined);

      const dto = {
        vehicleId: 'vehicle1',
        driverId: 'driver1',
        reason: 'Business',
      };

      service.startVehicleUsage(dto);

      const allUsages = service.findAll();

      expect(allUsages[0].driverName).toBe('Unknown Drive');
      expect(allUsages[0].brand).toBe('Unknown Vehicle');
    });
  });
});
