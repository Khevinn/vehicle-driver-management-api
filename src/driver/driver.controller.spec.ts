import { Test, TestingModule } from '@nestjs/testing';
import { DriverService } from './driver.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { DriverController } from './driver.controller';

describe('DriverController', () => {
  let controller: DriverController;

  const mockDriverService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DriverController],
      providers: [
        {
          provide: DriverService,
          useValue: mockDriverService,
        },
      ],
    }).compile();

    controller = module.get<DriverController>(DriverController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a driver', async () => {
    const dto: CreateDriverDto = { name: 'João' };
    const expectedResult = { id: '123', ...dto };

    mockDriverService.create.mockReturnValue(expectedResult);

    const result = controller.create(dto);
    expect(result).toEqual(expectedResult);
    expect(mockDriverService.create).toHaveBeenCalledWith(dto);
  });

  it('should return all drivers', async () => {
    const expectedResult = [{ id: '1', name: 'João' }];
    mockDriverService.findAll.mockReturnValue(expectedResult);

    const result = controller.findAll();
    expect(result).toEqual(expectedResult);
    expect(mockDriverService.findAll).toHaveBeenCalledWith(undefined);
  });

  it('should return drivers filtered by name', async () => {
    const expectedResult = [{ id: '1', name: 'Maria' }];
    mockDriverService.findAll.mockReturnValue(expectedResult);

    const result = controller.findAll({ name: 'Maria' });
    expect(result).toEqual(expectedResult);
    expect(mockDriverService.findAll).toHaveBeenCalledWith({ name: 'Maria' });
  });

  it('should return a driver by id', async () => {
    const expectedResult = { id: '1', name: 'João' };
    mockDriverService.findOne.mockReturnValue(expectedResult);

    const result = controller.findOne('1');
    expect(result).toEqual(expectedResult);
    expect(mockDriverService.findOne).toHaveBeenCalledWith('1');
  });

  it('should update a driver', async () => {
    const dto: UpdateDriverDto = { name: 'Carlos' };
    const expectedResult = { id: '1', ...dto };

    mockDriverService.update.mockReturnValue(expectedResult);

    const result = controller.update('1', dto);
    expect(result).toEqual(expectedResult);
    expect(mockDriverService.update).toHaveBeenCalledWith('1', dto);
  });

  it('should delete a driver', async () => {
    const expectedResult = { deleted: true };

    mockDriverService.remove.mockReturnValue(expectedResult);

    const result = controller.remove('1');
    expect(result).toEqual(expectedResult);
    expect(mockDriverService.remove).toHaveBeenCalledWith('1');
  });
});
