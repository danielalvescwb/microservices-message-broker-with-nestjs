import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Category } from 'src/categories/schemas/category.schema';
import { ValidationParamsPipe } from 'src/shared/pipes/validationParams.pipe';
import { ClientProxyRMQProvider } from 'src/shared/proxyrmq/clientProxyRMQProvider';
import { CreatePlayerDTO } from './dtos/createPlayer.dto';
import { UpdatePlayerDTO } from './dtos/updatePlayer.dto';

@Controller('api/v1/players')
export class PlayersController {
  private logger = new Logger(PlayersController.name);

  constructor(private clientProxyRMQProvider: ClientProxyRMQProvider) {}

  private client = this.clientProxyRMQProvider.getClientProxyInstance();

  @Post()
  @UsePipes(ValidationPipe)
  async createPlayer(@Body() createPlayerDto: CreatePlayerDTO) {
    this.logger.log(`createPlayerDto: ${JSON.stringify(createPlayerDto)}`);

    const categoria: Category = await this.client
      .send('get-categories', createPlayerDto)
      .toPromise();

    if (categoria) {
      await this.client.emit('create-player', createPlayerDto);
    } else {
      throw new BadRequestException(`Categoria não cadastrada!`);
    }
  }

  @Get()
  consultarJogadores(@Query('idPlayer') _id: string): Observable<any> {
    try {
      return this.client.send('select-player', _id ? _id : '');
    } catch (error) {
      console.log(error);
    }
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async updatePlayer(
    @Body() updatePlayerDTO: UpdatePlayerDTO,
    @Param('_id', ValidationParamsPipe) _id: string,
  ) {
    const category: Category = await this.client
      .send('get-categories', updatePlayerDTO)
      .toPromise();

    if (category) {
      await this.client.emit('update-player', {
        _id,
        player: updatePlayerDTO,
      });
    } else {
      throw new BadRequestException(`Categoria não cadastrada!`);
    }
  }

  @Delete('/:_id')
  async deletarJogador(@Param('_id', ValidationParamsPipe) _id: string) {
    await this.client.emit('delete-player', { _id });
  }
}
