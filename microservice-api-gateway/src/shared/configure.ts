import { Injectable } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Injectable()
export class Configure {
  getConfig() {
    return ClientsModule.register([
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
    ]);
  }
}
