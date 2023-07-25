import { Controller, Get, Post } from '@nestjs/common';
import { CounterService } from './counter.service';
import { ApiTags } from '@nestjs/swagger';
import { Counter } from './counter.dto';

@ApiTags('counter')
@Controller('counter')
export class CounterController {
  constructor(private readonly counterService: CounterService) {}

  /* increment the counter and return the new value */
  @Post()
  async increment(): Promise<number> {
    return this.counterService.increment();
  }

  /* get the current value of the counter */
  @Get('count')
  async get(): Promise<number> {
    return this.counterService.get();
  }

  /* a list each increments */
  @Get()
  async list(): Promise<Counter[]> {
    return this.counterService.list();
  }
}
