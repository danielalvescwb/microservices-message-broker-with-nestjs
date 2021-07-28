import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CategoriesController } from './categories/categories.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ADMIN-CLIENT',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://guest:guest@localhost:5672/smartranking'],
          queue: 'admin-backend',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [CategoriesController],
  providers: [],
})
export class AppModule {}
