import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { CreateCategoryDTO } from './dtos/createCategory.dto';

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
}
