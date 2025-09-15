import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateTeamInput } from './dto/create-team.input';
import { UpdateTeamInput } from './dto/update-team.input';
import { InjectModel } from '@nestjs/mongoose';
import { TeamMemberProfile } from './schema/team.schema';
import { Model, Types } from 'mongoose';
import { UsersService } from 'src/users/users.service';
import { UpsertTeamMemberProfileInput } from './dto/upsert-team-member-profile.input';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class TeamService {
  constructor(
    @InjectModel(TeamMemberProfile.name)
    private readonly profileModel: Model<TeamMemberProfile>,

    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
  ) {}

  async upsertTeamMemberProfile(input: UpsertTeamMemberProfileInput) {
    // valida user
    const user = await this.usersService.userById(input.user);

    const update: any = {
      ...(input.roleTitle !== undefined && { title: input.roleTitle }),
      ...(input.manager !== undefined && {
        manager: input.manager ? new Types.ObjectId(input.manager) : null,
      }),
      ...(input.employmentType !== undefined && {
        employmentType: input.employmentType,
      }),
      ...(input.contractStart !== undefined && {
        contractStart: input.contractStart,
      }),
      ...(input.contractEnd !== undefined && {
        contractEnd: input.contractEnd,
      }),
      ...(input.timezone !== undefined && { timezone: input.timezone }),
      ...(input.country !== undefined && { country: input.country }),
      ...(input.state !== undefined && { state: input.state }),
      ...(input.city !== undefined && { city: input.city }),
      ...(input.phone !== undefined && { phone: input.phone }),
      //workHours number
      ...(input.workHours !== undefined && { workHours: input.workHours }),
      ...(input.birthday !== undefined && { birthday: input.birthday }),
      ...(input.isActive !== undefined && { isActive: input.isActive }),
      ...(input.tags !== undefined && { tags: input.tags }),
      ...(input.description !== undefined && {
        description: input.description,
      }),
      updatedAt: new Date(),
    };

    const doc = await this.profileModel.findOneAndUpdate(
      { user: new Types.ObjectId(input.user) },
      {
        $set: update,
        $setOnInsert: {
          user: new Types.ObjectId(input.user),
          createdAt: new Date(),
        },
      },
      { upsert: true, new: true },
    );
    if (user.registrationStatus === 'completed') {
      const dashboardLink = `${process.env.FRONTEND_URL}/dashboard`;
      //ahora enviar email
      await this.mailService.sendTeamMemberUpdateData(
        user.email,
        user.firstName,
        'Bespire',
        dashboardLink,
      );
    }

    return doc;
  }

  async teamMemberProfileByUser(userId: string) {
    const p = await this.profileModel.findOne({
      user: new Types.ObjectId(userId),
    });
    // Si no existe, opcional: retorna null en lugar de error
    return p;
  }
}
