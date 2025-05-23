import { Test, TestingModule } from '@nestjs/testing';
import { VehicleController } from './vehicle.controller';
import { VehicleService } from './vehicle.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { FilterVehicleDto } from './dto/filter-vehicle.dto';
import { VehicleBrand, VehicleColor } from './entities/vehicle.enum';

describe('VehicleController', () => {
  let controller: VehicleController;
  let service: VehicleService;

  const mockVehicleService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehicleController],
      providers: [
        {
          provide: VehicleService,
          useValue: mockVehicleService,
        },
      ],
    }).compile();

    controller = module.get<VehicleController>(VehicleController);
    service = module.get<VehicleService>(VehicleService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a vehicle', () => {
      const dto: CreateVehicleDto = {
        plate: 'ABC1234',
        color: VehicleColor.White,
        brand: VehicleBrand.Ford,
      };
      const created = { id: '1', ...dto };
      mockVehicleService.create.mockReturnValue(created);

      expect(controller.create(dto)).toEqual(created);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return all vehicles with optional filter', () => {
      const filter: FilterVehicleDto = { color: VehicleColor.Black };
      const vehicles = [
        { id: '1', plate: 'ABC1234', brand: VehicleBrand.Toyota },
      ];
      mockVehicleService.findAll.mockReturnValue(vehicles);

      expect(controller.findAll(filter)).toEqual(vehicles);
      expect(service.findAll).toHaveBeenCalledWith(filter);
    });
  });

  describe('findOne', () => {
    it('should return a vehicle by id', () => {
      const vehicle = { id: '1', plate: 'XYZ9876', brand: VehicleBrand.Audi };
      mockVehicleService.findOne.mockReturnValue(vehicle);

      expect(controller.findOne('1')).toEqual(vehicle);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update a vehicle', () => {
      const dto: UpdateVehicleDto = { brand: VehicleBrand.Volkswagen };
      const updated = {
        id: '1',
        plate: 'XYZ9876',
        brand: VehicleBrand.BMW,
      };
      mockVehicleService.update.mockReturnValue(updated);

      expect(controller.update('1', dto)).toEqual(updated);
      expect(service.update).toHaveBeenCalledWith('1', dto);
    });
  });

  describe('remove', () => {
    it('should remove a vehicle by id', () => {
      mockVehicleService.remove.mockReturnValue(undefined);

      expect(controller.remove('1')).toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith('1');
    });
  });
});
