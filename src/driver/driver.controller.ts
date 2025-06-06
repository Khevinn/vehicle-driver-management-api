import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { DriverService } from './driver.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { FilterDriverDto } from './dto/filter-driver.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Driver')
@Controller('driver')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Post()
  create(@Body() createDriverDto: CreateDriverDto) {
    return this.driverService.create(createDriverDto);
  }

  @Get()
  findAll(@Query() filter?: FilterDriverDto) {
    return this.driverService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.driverService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDriverDto: UpdateDriverDto) {
    return this.driverService.update(id, updateDriverDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.driverService.remove(id);
  }
}
