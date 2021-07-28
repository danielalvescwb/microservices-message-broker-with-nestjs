import { Module } from '@nestjs/common';
import { ChallengeController } from './challenge.controller';
import { ChallengeService } from './challenge.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ChallengeSchema, Challenge } from './schemas/challenge.schema';
import { GameSchema, Game } from './schemas/game.schema';
import { PlayersModule } from '../players/players.module';
import { CategoriesModule } from '../categories/categories.module';

/*
Desafio
*/

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Challenge.name, schema: ChallengeSchema },
      { name: Game.name, schema: GameSchema },
    ]),
    PlayersModule,
    CategoriesModule,
  ],
  controllers: [ChallengeController],
  providers: [ChallengeService],
})
export class ChallengeModule {}
