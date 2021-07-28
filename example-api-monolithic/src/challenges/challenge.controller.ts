import {
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  Body,
  Get,
  Query,
  Put,
  Param,
  Delete,
  Logger,
} from '@nestjs/common';
import { ChallengeService } from './challenge.service';
import { CreateChallengeGameDto } from './dtos/createChallengeGame.dto';
import { Challenge } from './schemas/challenge.schema';
import { ChallangeStatusValidationPipe } from './pipes/challengeStatusValidation.pipe';
import { SetChallengeGameDTO } from './dtos/setChallengeGame.dto';
import { UpdateChallengeGameDTO } from './dtos/updateChallengeGame.dto';

@Controller('api/v1/challenge')
export class ChallengeController {
  constructor(private readonly challengeService: ChallengeService) {}

  private readonly logger = new Logger(ChallengeController.name);

  @Post()
  @UsePipes(ValidationPipe)
  async createChallenge(
    @Body() createChallengeGameDto: CreateChallengeGameDto,
  ): Promise<Challenge> {
    this.logger.log(
      `createChallengeGameDto: ${JSON.stringify(createChallengeGameDto)}`,
    );
    return await this.challengeService.createChallenge(createChallengeGameDto);
  }

  @Get()
  async consultarDesafios(
    @Query('idPlayer') _id: string,
  ): Promise<Array<Challenge>> {
    return _id
      ? await this.challengeService.consultarDesafiosDeUmJogador(_id)
      : await this.challengeService.consultarTodosDesafios();
  }

  @Put('/:idChallenge')
  async atualizarDesafio(
    @Body(ChallangeStatusValidationPipe)
    atualizarDesafioDto: UpdateChallengeGameDTO,
    @Param('idChallenge') _id: string,
  ): Promise<void> {
    await this.challengeService.atualizarDesafio(_id, atualizarDesafioDto);
  }

  @Post('/set-game/:idChallenge/')
  async atribuirDesafioPartida(
    @Body(ValidationPipe) atribuirDesafioPartidaDto: SetChallengeGameDTO,
    @Param('idChallenge') _id: string,
  ): Promise<void> {
    return await this.challengeService.atribuirDesafioPartida(
      _id,
      atribuirDesafioPartidaDto,
    );
  }

  @Delete('/:_id')
  async deletarDesafio(@Param('_id') _id: string): Promise<void> {
    await this.challengeService.deletarDesafio(_id);
  }
}
