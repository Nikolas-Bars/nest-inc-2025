import { pipesSetup } from './pipes.setup';
import { INestApplication } from '@nestjs/common';
import { globalPrefixSetup } from './global-prefix.setup';
import { swaggerSetup } from './swagger.setup';
import { ValidationExceptionFilter } from '../core/filters/validation-exception.filter';

export function appSetup(app: INestApplication) {
  app.useGlobalFilters(new ValidationExceptionFilter());
  pipesSetup(app);
  globalPrefixSetup(app);
  swaggerSetup(app);
}
