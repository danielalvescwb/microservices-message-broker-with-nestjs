import { InjectModel } from '@nestjs/mongoose';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';

import { CreatePlayerDTO } from './dtos/createPlayer.dto';
import { UpdatePlayerDTO } from './dtos/updatePlayer.dto';
import { Player, IPlayer } from './schemas/player.schema';

@Injectable()
export class PlayersService {
  private readonly logger = new Logger(PlayersService.name);
  constructor(
    @InjectModel(Player.name)
    private readonly playerModel: Model<IPlayer>,
  ) {}
  async createPlayers(createPlayerDTO: CreatePlayerDTO): Promise<Player> {
    const { email } = createPlayerDTO;
    const playerExists = await this.playerModel.findOne({ email }).exec();
    if (playerExists) {
      throw new BadRequestException(
        `Player with email: ${email} already exists`,
      );
    }
    const player = new this.playerModel(createPlayerDTO);
    return await player.save();
  }

  async updatePlayers(
    _id: string,
    updatePlayerDTO: UpdatePlayerDTO,
  ): Promise<void> {
    const playerExists = await this.playerModel.findOne({ _id }).exec();
    if (!playerExists) {
      throw new NotFoundException(`Player with _id: ${_id} not found`);
    }
    await this.playerModel
      .findOneAndUpdate({ _id }, { $set: updatePlayerDTO })
      .exec();
  }

  async getAllPlayers(): Promise<IPlayer[]> {
    return await this.playerModel.find().exec();
  }

  async getPlayerById(_id: string): Promise<Player> {
    const playerExists = await this.playerModel.findOne({ _id }).exec();
    if (!playerExists)
      throw new NotFoundException(`Player with _id ${_id} not found`);
    return playerExists;
  }

  async deletePlayerById(_id: string): Promise<any> {
    const playerExists = await this.playerModel.findOne({ _id }).exec();
    if (!playerExists)
      throw new NotFoundException(`Player with _id ${_id} not found`);
    return await this.playerModel.deleteOne({ _id }).exec();
  }
}
