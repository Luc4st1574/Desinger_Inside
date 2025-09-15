import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, MinLength } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @MinLength(6)
  password: string;

  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  contactNumber?: string;

  @Field({ nullable: true })
  companyName?: string;

  @Field({ nullable: true })
  companyRole?: string;
}

@InputType()
export class CreateTeamMemberByAdmin {
  @Field({ nullable: false }) email: string;
  @Field({ nullable: false }) fullName?: string;
  @Field({ nullable: false }) teamRole: string;
  @Field({ nullable: true }) titleRole: string;
  @Field({ nullable: true }) avatarUrl?: string;
}
