import { Controller, Logger } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { CategoriesService } from './categories.service';
import { CreateCategoryDTO } from './dtos/createCategory.dto';

@Controller()
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}
  private readonly logger = new Logger(CategoriesController.name);

  @EventPattern('create-category')
  async createCategory(@Payload() category: CreateCategoryDTO) {
    this.logger.log(`category: ${JSON.stringify(category)}`);
    await this.categoriesService.createCategory(category);
  }

  @MessagePattern('get-categories')
  async getCategories(@Payload() _id: string) {
    if (_id) {
      return await this.categoriesService.getCategoryById(_id);
    } else {
      return await this.categoriesService.getAllCategories();
    }
  }
}
