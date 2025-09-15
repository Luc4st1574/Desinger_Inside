import { Field, Float, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserTeamMember {
  //ID
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  fullName?: string;

  //firstName
  @Field({ nullable: true })
  firstName?: string;

  //lastName
  @Field({ nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  teamRole?: string;

  //role
  @Field({ nullable: true })
  roleMember?: string;

  //titleRole
  @Field({ nullable: true })
  title?: string;

  //avatarUrl
  @Field({ nullable: true })
  avatarUrl?: string;

  @Field({ nullable: true })
  description?: string;

  //opcionales de team
  //avatarUrl
  @Field({ nullable: true })
  manager?: UserTeamMember;
  @Field({ nullable: true })
  contractStart?: Date;
  @Field({ nullable: true })
  contractEnd?: Date;
  @Field({ nullable: true })
  employmentType?: string;

  @Field({ nullable: true })
  timezone?: string; // “America/Los_Angeles”

  @Field({ nullable: true })
  country?: string;

  @Field({ nullable: true })
  state?: string;

  @Field({ nullable: true })
  city?: string;

  //workHours
  @Field({ nullable: true })
  workHours?: number;

  @Field({ nullable: true })
  phone?: string; // si no quieres mezclar con User.contactNumber

  @Field({ nullable: true })
  birthday?: Date;

  @Field({ nullable: true })
  isActive?: boolean;

  @Field(() => [String], { nullable: true })
  tags?: string[]; // chips
}

//TeamListForAdmin
@ObjectType()
export class TeamListAdmin {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  avatarUrl?: string;

  @Field({ nullable: true })
  roleTitle?: string;

  @Field()
  workspaceId: string;

  // Rating (average from reviews)
  @Field(() => Float, { defaultValue: 0 })
  rating: number;

  @Field(() => Float, { defaultValue: 0 })
  kpi: number;

  @Field(() => Float, { defaultValue: 0 })
  tasks: number;

  @Field({ nullable: true })
  workHours?: string;

  // Time per request (average)
  @Field({ nullable: true })
  timeRequest?: string;

  @Field({ nullable: true })
  acceptTime?: string;

  @Field({ nullable: true })
  response?: string;

  // Average revisions per request
  @Field({ nullable: true })
  revisions?: number;

  // Last session date
  @Field({ nullable: true })
  lateRate?: number;
}
