import { Controller, Post, Body, Get, Put, Param } from '@nestjs/common';
import { UsagesService } from './usages.service';
import { StartUsageDto } from './dto/start-usage.dto';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Usages')
@Controller('usages')
export class UsagesController {
  constructor(private readonly usagesService: UsagesService) {}

  @Post('start')
  startVehicleUsage(@Body() startUsageDto: StartUsageDto) {
    return this.usagesService.startVehicleUsage(startUsageDto);
  }

  @Put('end/:usageId')
  endVehicleUsage(@Param('usageId') usageId: string) {
    return this.usagesService.endVehicleUsage(usageId);
  }

  @Get()
  findAll() {
    return this.usagesService.findAll();
  }
}
