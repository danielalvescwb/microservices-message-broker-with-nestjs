import {
  Body,
  Controller,
  Inject,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateCategoryDTO } from './dtos/createCategory.dto';

@Controller('api/v1/category')
export class CategoriesController {
  constructor(@Inject('ADMIN-CLIENT') private client: ClientProxy) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createCategory(@Body() createCategoryDTO: CreateCategoryDTO) {
    return await this.client.emit('create-category', createCategoryDTO);
  }
}
