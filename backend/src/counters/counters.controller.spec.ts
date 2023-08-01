import { Test, TestingModule } from '@nestjs/testing';
import { CountersController } from './counters.controller';
import { CountersService } from './counters.service';

describe('CountersController', () => {
  let controller: CountersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CountersController],
      providers: [CountersService],
    }).compile();

    controller = module.get<CountersController>(CountersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
