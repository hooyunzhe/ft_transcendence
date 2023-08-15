import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { TypeORMError } from 'typeorm';

@Catch(TypeORMError)
export class TypeORMErrorFilter implements ExceptionFilter {
  catch(exception: TypeORMError, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();

    response.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      error: 'Bad Request',
      message: exception.message.split('\n'),
      // for dev
      details: exception.stack.split('\n'),
    });
  }
}
