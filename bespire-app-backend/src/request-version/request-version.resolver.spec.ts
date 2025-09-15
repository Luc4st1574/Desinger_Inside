import { Test, TestingModule } from '@nestjs/testing';
import { RequestVersionResolver } from './request-version.resolver';
import { RequestVersionService } from './request-version.service';

describe('RequestVersionResolver', () => {
  let resolver: RequestVersionResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RequestVersionResolver, RequestVersionService],
    }).compile();

    resolver = module.get<RequestVersionResolver>(RequestVersionResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
