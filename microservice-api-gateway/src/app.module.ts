import { Module } from '@nestjs/common';
import { CategoriesModule } from './categories/categories.module';
import { ChallengeModule } from './challenges/challenge.module';
import { PlayersModule } from './players/players.module';
import { ClientProxyRMQProvider } from './shared/proxyrmq/clientProxyRMQProvider';

@Module({
  imports: [CategoriesModule, ChallengeModule, PlayersModule],
  controllers: [],
  providers: [ClientProxyRMQProvider],
})
export class AppModule {}
