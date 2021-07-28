import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDTO } from './dtos/createCategory.dto';
import { UpdateCategoryDTO } from './dtos/updateCategory.dto';
import { Category } from './schemas/category.schema';

@Controller('api/v1/category')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createCategory(
    @Body() createCategoryDTO: CreateCategoryDTO,
  ): Promise<Category> {
    return await this.categoriesService.createCategory(createCategoryDTO);
  }

  @Get()
  async getCategories(
    @Query() params: string[],
  ): Promise<Array<Category> | Category> {
    const idCategoria = params['idCategoria'];
    const idJogador = params['idJogador'];

    if (idCategoria) {
      return await this.categoriesService.getCategoryByCategory(idCategoria);
    }

    if (idJogador) {
      return await this.categoriesService.getCategoryOfPlayerById(idJogador);
    }
    return await this.categoriesService.getCategories();
  }

  // @Get(':category')
  // async getCategoryByCategory(
  //   @Param('category') category: string,
  // ): Promise<Category> {
  //   return await this.categoriesService.getCategoryByCategory(category);
  // }

  @Put(':category')
  @UsePipes(ValidationPipe)
  async updateCategory(
    @Body() updateCategoryDTO: UpdateCategoryDTO,
    @Param('category') category: string,
  ): Promise<void> {
    await this.categoriesService.updateCategory(category, updateCategoryDTO);
  }

  @Post(':category/set-new-player/:idPlayer')
  async setPlayerInCategory(@Param() params: string[]): Promise<void> {
    await this.categoriesService.setPlayerInCategory(params);
  }
}
