// src/services/services.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateServiceInput } from './dto/create-service.input';
import { UpdateServiceInput } from './dto/update-service.input';
import { Service } from './schema/service.schema';
import { ServiceCategory } from './schema/service-category.schema';

@Injectable()
export class ServicesService {
  constructor(
    @InjectModel(Service.name) private serviceModel: Model<Service>,
    @InjectModel(ServiceCategory.name)
    private serviceCategoryModel: Model<ServiceCategory>,
  ) {}

  async createCategory(input: {
    name: string;
    description?: string;
  }): Promise<ServiceCategory> {
    const newCategory = new this.serviceCategoryModel(input);
    return newCategory.save();
  }

  async findAllCategories(): Promise<ServiceCategory[]> {
    return this.serviceCategoryModel.find({ status: 'active' }).exec();
  }

  async create(input: CreateServiceInput): Promise<Service> {
    const serviceData = {
      ...input,
      category: input.categoryId, // Mapeamos categoryId a category
    };
    const newService = new this.serviceModel(serviceData);
    await newService.save();
    // Hacemos populate al devolver para que GraphQL tenga el objeto completo
    return newService.populate('category');
  }

  async findAll() {
    return this.serviceModel
      .find()
      .populate('category')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<Service> {
    return this.serviceModel.findById(id).populate('category').exec();
  }

  async update(
    id: string,
    updateServiceInput: UpdateServiceInput,
  ): Promise<Service> {
    return this.serviceModel
      .findByIdAndUpdate(id, updateServiceInput, {
        new: true,
      })
      .populate('category');
  }

  async remove(id: string): Promise<Service> {
    return this.serviceModel.findByIdAndDelete(id);
  }
}
