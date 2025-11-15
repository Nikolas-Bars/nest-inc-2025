import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as any;

    // Если это ошибка валидации (массив строк с сообщениями)
    if (Array.isArray(exceptionResponse.message)) {
      const errorsMessages = exceptionResponse.message.map((msg: string) => {
        // Парсим сообщение вида "field must be ..."
        const field = msg.split(' ')[0];
        return {
          message: msg,
          field: field,
        };
      });

      response.status(status).json({
        errorsMessages,
      });
    } else {
      // Обычная BadRequestException (не валидация)
      response.status(status).json(exceptionResponse);
    }
  }
}

