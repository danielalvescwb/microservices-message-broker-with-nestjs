import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Challenge } from './schemas/challenge.schema';
import { Game } from './schemas/game.schema';
import { Model } from 'mongoose';
import { CreateChallengeGameDto } from './dtos/createChallengeGame.dto';
import { PlayersService } from '../players/players.service';
import { UpdateChallengeGameDTO } from './dtos/updateChallengeGame.dto';
import { SetChallengeGameDTO } from './dtos/setChallengeGame.dto';
import { ChallangeStatus } from './enums/challangeStatus.enum';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class ChallengeService {
  constructor(
    @InjectModel(Challenge.name)
    private readonly desafioModel: Model<Challenge>,
    @InjectModel(Game.name) private readonly partidaModel: Model<Game>,
    private readonly playersService: PlayersService,
    private readonly categoriasService: CategoriesService,
  ) {}

  private readonly logger = new Logger(ChallengeService.name);

  async createChallenge(
    createChallengeGameDto: CreateChallengeGameDto,
  ): Promise<Challenge> {
    const jogadores = await this.playersService.getAllPlayers();

    createChallengeGameDto.players.map((playerDto) => {
      const jogadorFilter = jogadores.filter(
        (jogador) => jogador._id == playerDto._id,
      );

      if (jogadorFilter.length == 0) {
        throw new BadRequestException(
          `O id ${playerDto._id} não é um jogador!`,
        );
      }
    });

    /*
        Verificar se o solicitante é um dos jogadores da partida
        */

    const solicitanteEhJogadorDaPartida =
      await createChallengeGameDto.players.filter(
        (jogador) => jogador._id == createChallengeGameDto.requester,
      );

    this.logger.log(
      `solicitanteEhJogadorDaPartida: ${solicitanteEhJogadorDaPartida}`,
    );

    if (solicitanteEhJogadorDaPartida.length == 0) {
      throw new BadRequestException(
        `O solicitante deve ser um jogador da partida!`,
      );
    }

    /*
        Descobrimos a categoria com base no ID do jogador solicitante
        */
    const categoriaDoJogador =
      await this.categoriasService.getCategoryOfPlayerById(
        createChallengeGameDto.requester,
      );

    /*
        Para prosseguir o solicitante deve fazer parte de uma categoria
        */
    if (!categoriaDoJogador) {
      throw new BadRequestException(
        `O solicitante precisa estar registrado em uma categoria!`,
      );
    }

    const desafioCriado = new this.desafioModel(createChallengeGameDto);
    desafioCriado.category = categoriaDoJogador.category;
    desafioCriado.dateTimeRequest = new Date();
    /*
        Quando um desafio for criado, definimos o status desafio como pendente
        */
    desafioCriado.status = ChallangeStatus.PENDING;
    this.logger.log(`desafioCriado: ${JSON.stringify(desafioCriado)}`);
    return await desafioCriado.save();
  }

  async consultarTodosDesafios(): Promise<Array<Challenge>> {
    return await this.desafioModel
      .find()
      .populate('requester')
      .populate('players')
      .populate('games')
      .exec();
  }

  async consultarDesafiosDeUmJogador(_id: any): Promise<Array<Challenge>> {
    const jogadores = await this.playersService.getAllPlayers();

    const jogadorFilter = jogadores.filter((jogador) => jogador._id == _id);

    if (jogadorFilter.length == 0) {
      throw new BadRequestException(`O id ${_id} não é um jogador!`);
    }

    return await this.desafioModel
      .find()
      .where('players')
      .in(_id)
      .populate('requester')
      .populate('players')
      .populate('games')
      .exec();
  }

  async atualizarDesafio(
    _id: string,
    atualizarDesafioDto: UpdateChallengeGameDTO,
  ): Promise<void> {
    const desafioEncontrado = await this.desafioModel.findById(_id).exec();

    if (!desafioEncontrado) {
      throw new NotFoundException(`Desafio ${_id} não cadastrado!`);
    }

    /*
        Atualizaremos a data da resposta quando o status do desafio vier preenchido 
        */
    if (atualizarDesafioDto.status) {
      desafioEncontrado.dateTimeResponse = new Date();
    }
    desafioEncontrado.status = atualizarDesafioDto.status;
    desafioEncontrado.dateTimeChallenge = atualizarDesafioDto.dateTimeChallenge;

    await this.desafioModel
      .findOneAndUpdate({ _id }, { $set: desafioEncontrado })
      .exec();
  }

  async atribuirDesafioPartida(
    _id: string,
    atribuirDesafioPartidaDto: SetChallengeGameDTO,
  ): Promise<void> {
    const desafioEncontrado = await this.desafioModel.findById({ _id }).exec();

    if (!desafioEncontrado) {
      throw new BadRequestException(`Desafio ${_id} não cadastrado!`);
    }
    console.log(desafioEncontrado);

    /*
        Verificar se o jogador vencedor faz parte do desafio
        */
    const jogadorFilter = desafioEncontrado.players.filter(
      (playerId) => playerId._id == atribuirDesafioPartidaDto.winner,
    );

    this.logger.log(`desafioEncontrado: ${desafioEncontrado}`);
    this.logger.log(`jogadorFilter: ${jogadorFilter}`);

    if (jogadorFilter.length == 0) {
      throw new BadRequestException(
        `O jogador vencedor não faz parte do desafio!`,
      );
    }

    /*
        Primeiro vamos criar e persistir o objeto partida
        */
    const partidaCriada = new this.partidaModel(atribuirDesafioPartidaDto);

    /*
       Atribuir ao objeto partida a categoria recuperada no desafio
       */
    partidaCriada.category = desafioEncontrado.category;

    /*
       Atribuir ao objeto partida os jogadores que fizeram parte do desafio
       */
    partidaCriada.players = desafioEncontrado.players;
    // ---------------------------------------------------------------------------------

    console.log(partidaCriada);

    const resultado = await partidaCriada.save();

    /*
        Quando uma partida for registrada por um usuário, mudaremos o 
        status do desafio para realizado
        */
    desafioEncontrado.status = ChallangeStatus.FINISHED;

    /*  
        Recuperamos o ID da partida e atribuimos ao desafio
        */
    desafioEncontrado.games = resultado._id;

    try {
      await this.desafioModel
        .findOneAndUpdate({ _id }, { $set: desafioEncontrado })
        .exec();
    } catch (error) {
      /*
            Se a atualização do desafio falhar excluímos a partida 
            gravada anteriormente
            */
      await this.partidaModel.deleteOne({ _id: resultado._id }).exec();
      throw new InternalServerErrorException();
    }
  }

  async deletarDesafio(_id: string): Promise<void> {
    const desafioEncontrado = await this.desafioModel.findById(_id).exec();

    if (!desafioEncontrado) {
      throw new BadRequestException(`Desafio ${_id} não cadastrado!`);
    }

    /*
        Realizaremos a deleção lógica do desafio, modificando seu status para
        CANCELADO
        */
    desafioEncontrado.status = ChallangeStatus.CANCELED;

    await this.desafioModel
      .findOneAndUpdate({ _id }, { $set: desafioEncontrado })
      .exec();
  }
}
