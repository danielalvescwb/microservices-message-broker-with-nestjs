import { Module } from '@nestjs/common';
import { ClientProxyRMQProvider } from './clientProxyRMQProvider';

@Module({
  providers: [ClientProxyRMQProvider],
  exports: [ClientProxyRMQProvider],
})
export class ProxyRMQModule {}
