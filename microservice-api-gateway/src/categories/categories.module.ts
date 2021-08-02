import { Module } from '@nestjs/common';
import { ProxyRMQModule } from 'src/shared/proxyrmq/proxyrmq.module';
import { CategoriesController } from './categories.controller';

@Module({
  imports: [ProxyRMQModule],
  controllers: [CategoriesController],
})
export class CategoriesModule {}
