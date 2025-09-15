import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { TeamService } from './team.service';
import { Team } from './entities/team.entity';
import { CreateTeamInput } from './dto/create-team.input';
import { UpdateTeamInput } from './dto/update-team.input';
import { TeamMemberProfile } from './schema/team.schema';
import { UpsertTeamMemberProfileInput } from './dto/upsert-team-member-profile.input';

@Resolver(() => Team)
export class TeamResolver {
  constructor(private readonly teamService: TeamService) {}
  @Mutation(() => TeamMemberProfile)
  upsertTeamMemberProfile(@Args('input') input: UpsertTeamMemberProfileInput) {
    return this.teamService.upsertTeamMemberProfile(input);
  }

  @Query(() => TeamMemberProfile, { nullable: true })
  teamMemberProfileByUser(@Args('userId', { type: () => ID }) userId: string) {
    return this.teamService.teamMemberProfileByUser(userId);
  }
}
