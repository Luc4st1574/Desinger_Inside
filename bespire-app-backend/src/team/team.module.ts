import { forwardRef, Module } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamResolver } from './team.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TeamMemberProfile,
  TeamMemberProfileSchema,
} from './schema/team.schema';
import { UsersModule } from 'src/users/users.module';
import { MailService } from 'src/mail/mail.service';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    MongooseModule.forFeature([
      { name: TeamMemberProfile.name, schema: TeamMemberProfileSchema },
    ]),
  ],
  providers: [TeamResolver, TeamService, MailService],
  exports: [TeamService],
})
export class TeamModule {}
