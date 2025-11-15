import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appSetup } from './setup/app.setup';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser()); // Парсинг кук из запросов

  appSetup(app); //глобальные настройки приложения

  const PORT = process.env.PORT || 5005; //TODO: move to configService. will be in the following lessons

  await app.listen(PORT, () => {
    console.log('Server is running on port ' + PORT);
  });
}
bootstrap();
