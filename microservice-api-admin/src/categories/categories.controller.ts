import {
  Body,
  Controller,
  Logger,
  Param,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { CategoriesService } from './categories.service';
import { CreateCategoryDTO } from './dtos/createCategory.dto';
import { UpdateCategoryDTO } from './dtos/updateCategory.dto';

const ackErrors = ['E11000'];

interface IUpdateCategory {
  _id: string;
  category: UpdateCategoryDTO;
}

@Controller()
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}
  private readonly logger = new Logger(CategoriesController.name);

  @EventPattern('create-category')
  async createCategory(
    @Payload() category: CreateCategoryDTO,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    this.logger.log(`category: ${JSON.stringify(category)}`);

    try {
      await this.categoriesService.createCategory(category);
      await channel.ack(originalMsg);
    } catch (error) {
      this.logger.log(`error: ${JSON.stringify(error.message)}`);
      const filterAckErrors = ackErrors.filter(async (ackError) => {
        error.message.includes(ackError);
      });
      if (filterAckErrors) await channel.ack(originalMsg);
    }
  }

  @MessagePattern('get-categories')
  async getCategories(@Payload() _id: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      if (_id) {
        return await this.categoriesService.getCategoryById(_id);
      } else {
        return await this.categoriesService.getAllCategories();
      }
    } catch (error) {
      this.logger.error(
        `getCategories error: ${JSON.stringify(error.message)}`,
      );
    } finally {
      await channel.ack(originalMsg);
    }
  }

  @EventPattern('update-category')
  async updateCategory(
    @Body() updateCategory: IUpdateCategory,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    this.logger.log(`category: ${JSON.stringify(updateCategory)}`);
    try {
      const { _id, category } = updateCategory;
      await this.categoriesService.updateCategory(_id, category);
      await channel.ack(originalMsg);
    } catch (error) {
      this.logger.error(
        `updateCategory error: ${JSON.stringify(error.message)}`,
      );
      const filterAckErrors = ackErrors.filter(async (ackError) => {
        error.message.includes(ackError);
      });
      if (filterAckErrors) await channel.ack(originalMsg);
    }
  }
}
