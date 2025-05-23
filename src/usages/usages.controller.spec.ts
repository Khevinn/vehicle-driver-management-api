import { Test, TestingModule } from '@nestjs/testing';
import { StartUsageDto } from './dto/start-usage.dto';
import { UsagesController } from './usages.controller';
import { UsagesService } from './usages.service';

describe('UsagesController', () => {
  let controller: UsagesController;
  let service: UsagesService;

  const mockUsagesService = {
    startVehicleUsage: jest.fn(),
    endVehicleUsage: jest.fn(),
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsagesController],
      providers: [{ provide: UsagesService, useValue: mockUsagesService }],
    }).compile();

    controller = module.get<UsagesController>(UsagesController);
    service = module.get<UsagesService>(UsagesService);

    jest.clearAllMocks();
  });

  describe('startVehicleUsage', () => {
    it('should call usagesService.startVehicleUsage with dto and return result', () => {
      const dto: StartUsageDto = {
        vehicleId: 'vehicle123',
        driverId: 'driver123',
        reason: 'Business trip',
      };

      const usage = { id: 'usage1', ...dto, startDate: new Date() };
      mockUsagesService.startVehicleUsage.mockReturnValue(usage);

      const result = controller.startVehicleUsage(dto);

      expect(service.startVehicleUsage).toHaveBeenCalledWith(dto);
      expect(result).toBe(usage);
    });
  });

  describe('endVehicleUsage', () => {
    it('should call usagesService.endVehicleUsage with usageId and return result', () => {
      const usageId = 'usage123';
      const usageEnded = { id: usageId, endDate: new Date() };
      mockUsagesService.endVehicleUsage.mockReturnValue(usageEnded);

      const result = controller.endVehicleUsage(usageId);

      expect(service.endVehicleUsage).toHaveBeenCalledWith(usageId);
      expect(result).toBe(usageEnded);
    });
  });

  describe('findAll', () => {
    it('should call usagesService.findAll and return all usages', () => {
      const usagesArray = [
        {
          id: '1',
          driverName: 'Khevin',
          plate: 'ABC123',
          startDate: new Date(),
          reason: 'Test',
        },
      ];
      mockUsagesService.findAll.mockReturnValue(usagesArray);

      const result = controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toBe(usagesArray);
    });
  });
});
