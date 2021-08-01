import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PlayersService } from 'src/players/players.service';
import { CreateCategoryDTO } from './dtos/createCategory.dto';
import { UpdateCategoryDTO } from './dtos/updateCategory.dto';
import { Category } from './schemas/category.schema';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<Category>,
    private readonly playersService: PlayersService,
  ) {}
  private readonly logger = new Logger(CategoriesService.name);

  async createCategory(
    createCategoryDTO: CreateCategoryDTO,
  ): Promise<Category> {
    // const { category } = createCategoryDTO;
    // const categoryExists = await this.categoryModel
    //   .findOne({ category })
    //   .exec();
    // if (categoryExists)
    //   throw new NotFoundException(`Category ${category} already exists`);
    // const createCategory = new this.categoryModel(createCategoryDTO);
    // return await createCategory.save();

    try {
      const createCategory = new this.categoryModel(createCategoryDTO);
      return await createCategory.save();
    } catch (error) {
      this.logger.error(
        `error createCategory: ${JSON.stringify(error.message)}`,
      );
      throw new RpcException(error.message);
    }
  }

  async getAllCategories(): Promise<Category[]> {
    try {
      this.logger.log(`error getAllCategories: ok`);
      return await this.categoryModel
        .find()
        .populate({
          path: 'players',
          options: { limit: 5 },
          select: 'name email',
        })
        .exec();
    } catch (error) {
      this.logger.error(
        `error getAllCategories: ${JSON.stringify(error.message)}`,
      );
      throw new RpcException(error.message);
    }
  }

  async getCategoryById(_id: string): Promise<Category> {
    try {
      this.logger.log(`error getCategoryById: ${_id}`);
      return await this.categoryModel
        .findOne({ _id })
        .populate({
          path: 'players',
          select: 'name email',
        })
        .exec();
    } catch (error) {
      this.logger.error(
        `error getCategoryById: ${JSON.stringify(error.message)}`,
      );
      throw new RpcException(error.message);
    }
  }

  async updateCategory(
    _id: string,
    updateCategoryDTO: UpdateCategoryDTO,
  ): Promise<void> {
    try {
      const categoryExists = await this.categoryModel.findOne({ _id }).exec();
      if (!categoryExists)
        throw new RpcException(`Category ${_id} is not exists`);
      await this.categoryModel
        .findOneAndUpdate({ _id }, { $set: updateCategoryDTO })
        .exec();
    } catch (error) {
      this.logger.error(
        `error updateCategory: ${JSON.stringify(error.message)}`,
      );
      throw new RpcException(error.message);
    }
  }
}
