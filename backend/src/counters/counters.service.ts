import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Counter } from './counters.dto';

@Injectable()
export class CountersService {
  constructor(private prisma: PrismaService) {}

  async get() {
    return await this.prisma.counter.count();
  }

  async list(): Promise<Counter[]> {
    return await this.prisma.counter.findMany();
  }

  async increment() {
    return (await this.prisma.counter.create({})).id;
  }
}
