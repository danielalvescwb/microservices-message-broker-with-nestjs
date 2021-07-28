import { Module } from '@nestjs/common';
import { PlayersModule } from './players/players.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://api_user:api1234@localhost:27017/ms-api-admin',
      {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      },
    ),
    PlayersModule,
    CategoriesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
