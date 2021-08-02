import { Module } from '@nestjs/common';
import { ChallengeController } from './challenge.controller';
import { ProxyRMQModule } from 'src/shared/proxyrmq/proxyrmq.module';

@Module({
  imports: [ProxyRMQModule],
  controllers: [ChallengeController],
})
export class ChallengeModule {}
