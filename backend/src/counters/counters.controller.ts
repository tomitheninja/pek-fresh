import { Controller, Get, Post } from '@nestjs/common';
import { CountersService } from './counters.service';
import { ApiTags } from '@nestjs/swagger';
import { Counter } from './counters.dto';

@ApiTags('counters')
@Controller('counters')
export class CountersController {
  constructor(private readonly countersService: CountersService) {}

  /* increment the counter and return the new value */
  @Post()
  async increment(): Promise<number> {
    return this.countersService.increment();
  }

  /* get the current value of the counter */
  @Get('count')
  async getCount(): Promise<number> {
    return this.countersService.get();
  }

  /* a list each increments */
  @Get()
  async list(): Promise<Counter[]> {
    return this.countersService.list();
  }
}
