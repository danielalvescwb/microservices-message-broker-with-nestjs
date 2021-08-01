import { NestFactory } from '@nestjs/core';
import * as momentTimezone from 'moment-timezone';
import { AppModule } from './app.module';
import { httpExceptionFilter } from './shared/filters/httpException.filter';
import { LoggingInterceptor } from './shared/interceptors/loggingInterceptor';
import { TimeoutIntereptor } from './shared/interceptors/timeoutInterceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new LoggingInterceptor(), new TimeoutIntereptor());
  app.useGlobalFilters(new httpExceptionFilter());

  Date.prototype.toJSON = function (): any {
    return momentTimezone(this)
      .tz('America/Sao_Paulo')
      .format('YYYY-MM-DD HH:mm:ss.SSS');
  };
  await app.listen(3000);
}
bootstrap();
