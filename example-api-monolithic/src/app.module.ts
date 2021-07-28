import { Module } from '@nestjs/common';
import { PlayersModule } from './players/players.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesModule } from './categories/categories.module';
import { ChallengeModule } from './challenges/challenge.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://api_user:api1234@localhost:27017/api-monolithic',
      {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      },
    ),
    PlayersModule,
    CategoriesModule,
    ChallengeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
