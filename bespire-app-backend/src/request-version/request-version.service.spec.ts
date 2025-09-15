import { Test, TestingModule } from '@nestjs/testing';
import { RequestVersionService } from './request-version.service';

describe('RequestVersionService', () => {
  let service: RequestVersionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RequestVersionService],
    }).compile();

    service = module.get<RequestVersionService>(RequestVersionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
