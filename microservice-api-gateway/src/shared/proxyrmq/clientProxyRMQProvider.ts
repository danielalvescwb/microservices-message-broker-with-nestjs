import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ClientProxyRMQProvider {
  getClientProxyInstance(): ClientProxy {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://guest:guest@localhost:5672/virtual-host-api-tennis'],
        queue: 'admin-backend',
        queueOptions: {
          durable: false,
        },
      },
    });
  }
}
