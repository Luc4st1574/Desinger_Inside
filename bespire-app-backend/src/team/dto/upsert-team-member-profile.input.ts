import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class UpsertTeamMemberProfileInput {
  @Field(() => ID) user: string;

  @Field({ nullable: true }) roleTitle?: string;
  @Field(() => ID, { nullable: true }) manager?: string;
  @Field({ nullable: true }) employmentType?:
    | 'full_time'
    | 'part_time'
    | 'contractor';

  @Field({ nullable: true }) contractStart?: Date;
  @Field({ nullable: true }) contractEnd?: Date;
  //workHours number
  @Field({ nullable: true }) workHours?: number;

  @Field({ nullable: true }) timezone?: string;
  @Field({ nullable: true }) country?: string;
  @Field({ nullable: true }) state?: string;
  @Field({ nullable: true }) city?: string;

  @Field({ nullable: true }) phone?: string;
  @Field({ nullable: true }) birthday?: Date;

  @Field({ nullable: true }) isActive?: boolean;

  @Field(() => [String], { nullable: true }) tags?: string[];
  @Field({ nullable: true }) description?: string;
}
