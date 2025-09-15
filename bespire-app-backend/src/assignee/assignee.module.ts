import { forwardRef, Module } from '@nestjs/common';
import { AssigneeService } from './assignee.service';
import { AssigneeResolver } from './assignee.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Assignee, AssigneeSchema } from './schema/assignee.schema';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { RequestVersionModule } from 'src/request-version/request-version.module';

@Module({
  imports: [
    forwardRef(() => NotificationsModule),
    RequestVersionModule,
    MongooseModule.forFeature([
      { name: Assignee.name, schema: AssigneeSchema },
    ]),
  ],
  providers: [AssigneeResolver, AssigneeService],
  exports: [AssigneeService],
})
export class AssigneeModule {}
