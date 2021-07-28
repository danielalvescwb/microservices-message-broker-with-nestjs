import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreatePlayerDTO } from '../players/dtos/createPlayer.dto';
import { UpdatePlayerDTO } from '../players/dtos/updatePlayer.dto';
import { PlayersService } from './players.service';
import { Player } from './schemas/player.schema';
import { ValidationParamsPipe } from '../shared/pipes/validationParams.pipe';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playerService: PlayersService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createPlayers(
    @Body() createPlayerDTO: CreatePlayerDTO,
  ): Promise<Player> {
    return await this.playerService.createPlayers(createPlayerDTO);
  }
  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async updatePlayers(
    @Body() updatePlayerDTO: UpdatePlayerDTO,
    @Param('_id', ValidationParamsPipe) _id: string,
  ): Promise<void> {
    await this.playerService.updatePlayers(_id, updatePlayerDTO);
  }
  @Get()
  async getPlayers(): Promise<Player[]> {
    return this.playerService.getAllPlayers();
  }
  @Get('/:_id')
  async getPlayersByEmail(
    @Param('_id', ValidationParamsPipe) _id: string,
  ): Promise<Player> {
    return this.playerService.getPlayerById(_id);
  }
  @Delete('/:_id')
  async deletePlayerById(
    @Param('_id', ValidationParamsPipe) _id: string,
  ): Promise<void> {
    this.playerService.deletePlayerById(_id);
  }
}
