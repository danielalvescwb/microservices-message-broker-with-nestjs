import { Module } from '@nestjs/common';
import { PlayersController } from './players.controller';
import { ProxyRMQModule } from '../shared/proxyrmq/proxyrmq.module';

@Module({
  imports: [ProxyRMQModule],
  controllers: [PlayersController],
})
export class PlayersModule {}
