import { Module } from '@nestjs/common';
import { RequestVersionService } from './request-version.service';
import { RequestVersionResolver } from './request-version.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RequestVersion,
  RequestVersionSchema,
} from './schema/request-version.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RequestVersion.name, schema: RequestVersionSchema },
    ]),
  ],
  providers: [RequestVersionResolver, RequestVersionService],
  exports: [RequestVersionService],
})
export class RequestVersionModule {}
