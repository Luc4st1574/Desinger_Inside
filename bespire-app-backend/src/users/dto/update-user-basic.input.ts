import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateUserBasicInput {
  @Field({ nullable: false }) email: string;
  @Field({ nullable: true }) roleMember?: string;
  @Field({ nullable: true }) firstName?: string;
  @Field({ nullable: true }) fullName?: string;
  @Field({ nullable: true }) lastName?: string;
  @Field({ nullable: true }) teamRole?: string;
  @Field({ nullable: true }) titleRole?: string;
  @Field({ nullable: true }) avatarUrl?: string;
}
