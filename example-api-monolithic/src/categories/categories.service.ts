import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PlayersService } from 'src/players/players.service';
import { CreateCategoryDTO } from './dtos/createCategory.dto';
import { UpdateCategoryDTO } from './dtos/updateCategory.dto';
import { Category } from './schemas/category.schema';
import { Player } from '../players/schemas/player.schema';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<Category>,
    private readonly playersService: PlayersService,
  ) {}

  async createCategory(
    createCategoryDTO: CreateCategoryDTO,
  ): Promise<Category> {
    const { category } = createCategoryDTO;
    const categoryExists = await this.categoryModel
      .findOne({ category })
      .exec();
    if (categoryExists)
      throw new NotFoundException(`Category ${category} already exists`);
    const createCategory = new this.categoryModel(createCategoryDTO);
    return await createCategory.save();
  }

  async getCategories(): Promise<Category[]> {
    return await this.categoryModel
      .find()
      .populate({
        path: 'players',
        options: { limit: 2 },
        select: 'name email',
      })
      .exec();
  }

  async getCategoryByCategory(category: string): Promise<Category> {
    const categoryExists = await this.categoryModel
      .findOne({ category })
      .exec();
    if (!categoryExists)
      throw new NotFoundException(`Category ${category} is not exists`);
    return categoryExists;
  }

  async updateCategory(
    category: string,
    updateCategoryDTO: UpdateCategoryDTO,
  ): Promise<void> {
    const categoryExists = await this.categoryModel
      .findOne({ category })
      .exec();
    if (!categoryExists)
      throw new NotFoundException(`Category ${category} is not exists`);
    await this.categoryModel
      .findOneAndUpdate({ category }, { $set: updateCategoryDTO })
      .exec();
  }

  async setPlayerInCategory(params: string[]): Promise<void> {
    const category = params['category'];
    const idPlayer: string | any = params['idPlayer'];

    const categoriaEncontrada = await this.categoryModel
      .findOne({ category })
      .exec();
    const jogadorJaCadastradoCategoria = await this.categoryModel
      .findOne()
      .where('players')
      .in(idPlayer)
      .exec();
    console.log(jogadorJaCadastradoCategoria);

    const jogadores = await this.playersService.getAllPlayers();

    const jogadorFilter = jogadores.filter(
      (jogador) => jogador._id == idPlayer,
    );

    if (jogadorFilter.length == 0) {
      throw new BadRequestException(`O id ${idPlayer} não é um jogador!`);
    }

    if (!categoriaEncontrada) {
      throw new BadRequestException(`Categoria ${category} não cadastrada!`);
    }

    if (jogadorJaCadastradoCategoria) {
      throw new BadRequestException(
        `Jogador ${idPlayer} já cadastrado na Categoria ${jogadorJaCadastradoCategoria.category}!`,
      );
    }
    await this.categoryModel
      .findOneAndUpdate({ category }, { $push: { players: { _id: idPlayer } } })
      .exec();
  }

  async getCategoryOfPlayerById(idJogador: any): Promise<Category> {
    const jogadores = await this.playersService.getAllPlayers();

    const jogadorFilter = jogadores.filter(
      (jogador) => jogador._id == idJogador,
    );

    if (jogadorFilter.length == 0) {
      throw new BadRequestException(`O id ${idJogador} não é um jogador!`);
    }

    return await this.categoryModel
      .findOne()
      .where('players')
      .in(idJogador)
      .exec();
  }
}
