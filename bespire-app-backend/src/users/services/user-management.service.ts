import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { UpdateUserInput } from '../dto/update-user.input';
import { UpdatePreferencesInput } from '../dto/update-preferences.input';
import * as bcrypt from 'bcryptjs';
import { WorkspaceService } from 'src/workspace/workspace.service';

@Injectable()
export class UserManagementService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private workspaceService: WorkspaceService,
  ) {}

  async create(input: any): Promise<User> {
    return this.userModel.create(input);
  }

  // Actualiza los campos modificados, solo los que recibe en input
  async updateUser(userId: string, input: UpdateUserInput): Promise<string> {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) throw new UnauthorizedException('User not found');

      // Cambio de contraseña
      if (input.currentPassword || input.newPassword) {
        if (!input.currentPassword || !input.newPassword) {
          throw new UnauthorizedException(
            'You must provide both current and new passwords.',
          );
        }
        // Verifica que la contraseña actual es correcta
        const match = await bcrypt.compare(
          input.currentPassword,
          user.passwordHash,
        );
        if (!match)
          throw new UnauthorizedException('Current password is incorrect.');

        // Cambia la contraseña
        user.passwordHash = await bcrypt.hash(input.newPassword, 10);
      }

      // Actualiza sólo los campos que llegaron en input (patch)
      if (input.firstName !== undefined) user.firstName = input.firstName;
      if (input.lastName !== undefined) user.lastName = input.lastName;
      if (input.profilePicture !== undefined)
        user.avatarUrl = input.profilePicture;

      // Guarda los cambios
      await user.save();
      return 'User updated successfully';
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(userId: string, updateData: Partial<User>): Promise<User> {
    return this.userModel.findByIdAndUpdate(userId, updateData, { new: true });
  }

  async setUserPreferences(userId: string, input: UpdatePreferencesInput) {
    console.log('setUserPreferences', userId, input);
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    // Mezcla las prefs viejas y las nuevas (deep merge para objetos anidados)
    user.preferences = {
      ...(user.preferences || {}),
      ...(input || {}),
      //@ts-ignore
      channels: {
        ...(user.preferences?.channels || {}),
        ...(input.channels || {}),
      },
      //@ts-ignore
      specific: {
        ...(user.preferences?.specific || {}),
        ...(input.specific || {}),
      },
    };

    await user.save();
    return true;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findOne(query: any): Promise<User | null> {
    return this.userModel.findOne(query).exec();
  }

  async findById(userId: string): Promise<User | null> {
    return this.userModel.findById(userId).exec();
  }

  async findByIdAndUpdate(
    userId: string,
    updateData: any,
  ): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(userId, updateData, {
      new: true,
    });
  }

  async findByQuery(query: any): Promise<User[]> {
    return this.userModel.find(query).exec();
  }

  async completeOnboarding(userId: string, input: any) {
    await this.userModel.findByIdAndUpdate(userId, {
      registrationStatus: 'completed',
      onboardingData: input,
    });
  }

  async updateStripeCustomerId(userId: string, customerId: string) {
    await this.userModel.findByIdAndUpdate(userId, {
      stripeCustomerId: customerId,
    });
  }

  async updateOnboardingProgress(userId: string, partialData: any) {
    const { currentStep, ...onboardingFields } = partialData;

    const updateData: any = {
      $set: Object.keys(onboardingFields).reduce((acc, key) => {
        acc[`onboardingData.${key}`] = onboardingFields[key];
        return acc;
      }, {} as any),
    };

    if (currentStep !== undefined) {
      updateData.$set.currentStep = currentStep; // 👈 Guardamos currentStep al nivel raíz
    }

    await this.userModel.findByIdAndUpdate(userId, updateData);
  }

  async markUserAsPaid(userId: string) {
    await this.userModel.findByIdAndUpdate(userId, {
      hasPaid: true,
    });
  }

  async searchMembers(search: string) {
    return this.userModel
      .find({
        role: 'team_member',
        $or: [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { teamRole: { $regex: search, $options: 'i' } },
        ],
      })
      .exec();
  }

  //necesito un servicio para obtener el id del admin
  async findAdminId(): Promise<string | null> {
    const adminUser = await this.userModel.findOne({ role: 'admin' }).exec();
    return adminUser ? adminUser._id.toString() : null;
  }
}
