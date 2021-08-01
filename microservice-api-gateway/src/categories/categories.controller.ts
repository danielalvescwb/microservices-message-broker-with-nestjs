import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { CreateCategoryDTO } from './dtos/createCategory.dto';
import { UpdateCategoryDTO } from './dtos/updateCategory.dto';

@Controller('api/v1/category')
export class CategoriesController {
  constructor(@Inject('ADMIN-CLIENT') private client: ClientProxy) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createCategory(@Body() createCategoryDTO: CreateCategoryDTO) {
    this.client.emit('create-category', createCategoryDTO);
  }

  @Get()
  getCategoryById(@Query('idCategory') _id: string): Observable<any> {
    return this.client.send('get-categories', _id ? _id : '');
  }

  @Put(':idCategory')
  @UsePipes(ValidationPipe)
  async updateCategory(
    @Body() updateCategoryDTO: UpdateCategoryDTO,
    @Param('idCategory') _id: string,
  ): Promise<void> {
    this.client.emit('update-category', {
      _id,
      category: updateCategoryDTO,
    });
  }
}
