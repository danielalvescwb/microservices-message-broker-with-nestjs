import { Controller, Logger } from '@nestjs/common';
import { PlayersService } from './players.service';
import {
  EventPattern,
  Payload,
  Ctx,
  RmqContext,
  MessagePattern,
} from '@nestjs/microservices';
import { Player } from './schemas/player.schema';

const ackErrors: string[] = ['E11000'];

@Controller('api/v1/players')
export class PlayersController {
  logger = new Logger(PlayersController.name);
  constructor(private readonly jogadoresService: PlayersService) {}

  @EventPattern('criar-jogador')
  async criarJogador(@Payload() jogador: Player, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      this.logger.log(`jogador: ${JSON.stringify(jogador)}`);
      await this.jogadoresService.createPlayers(jogador);
      await channel.ack(originalMsg);
    } catch (error) {
      this.logger.log(`error: ${JSON.stringify(error.message)}`);
      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );

      if (filterAckError.length > 0) {
        await channel.ack(originalMsg);
      }
    }
  }

  @MessagePattern('consultar-jogadores')
  async consultarJogadores(@Payload() _id: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      if (_id) {
        return await this.jogadoresService.getPlayerById(_id);
      } else {
        return await this.jogadoresService.getAllPlayers();
      }
    } finally {
      await channel.ack(originalMsg);
    }
  }

  @EventPattern('atualizar-jogador')
  async atualizarJogador(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      console.log(`data: ${JSON.stringify(data)}`);
      const _id: string = data.id;
      const jogador: Player = data.jogador;
      await this.jogadoresService.updatePlayers(_id, jogador);
      await channel.ack(originalMsg);
    } catch (error) {
      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );

      if (filterAckError.length > 0) {
        await channel.ack(originalMsg);
      }
    }
  }

  @EventPattern('deletar-jogador')
  async deletarJogador(@Payload() _id: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      await this.jogadoresService.deletePlayerById(_id);
      await channel.ack(originalMsg);
    } catch (error) {
      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );

      if (filterAckError.length > 0) {
        await channel.ack(originalMsg);
      }
    }
  }
}
