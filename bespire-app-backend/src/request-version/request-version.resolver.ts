import { Args, ID, Query, Resolver } from '@nestjs/graphql';
import { RequestVersionService } from './request-version.service';
import { RequestVersionOut } from './dto/request-version.dto';

@Resolver()
export class RequestVersionResolver {
  constructor(private readonly requestVersionService: RequestVersionService) {}

  @Query(() => [RequestVersionOut], { name: 'requestChangeLog' })
  async getRequestChangeLog(
    @Args('requestId', { type: () => ID }) requestId: string,
  ) {
    return this.requestVersionService.findByRequestId(requestId);
  }
}
