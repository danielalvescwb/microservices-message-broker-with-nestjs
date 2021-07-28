import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { httpExceptionFilter } from './shared/filters/httpException.filter';
import * as momentTimezone from 'moment-timezone';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new httpExceptionFilter());

  Date.prototype.toJSON = function (): any {
    return momentTimezone(this)
      .tz('America/Sao_Paulo')
      .format('YYYY-MM-DD HH:mm:ss.SSS');
  };
  await app.listen(3000);
}
bootstrap();
