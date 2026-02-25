import { Response } from 'express';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';

type ExceptionResponseShape = {
  message?: string | string[];
  error?: string;
  statusCode?: number;
};

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let message = 'Unexpected error';

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (
      typeof exceptionResponse === 'object' &&
      exceptionResponse !== null
    ) {
      const res = exceptionResponse as ExceptionResponseShape;

      if (Array.isArray(res.message)) {
        message = res.message.join(', ');
      } else if (typeof res.message === 'string') {
        message = res.message;
      }
    }

    response.status(status).json({
      statusCode: status,
      error: exception.name,
      message,
    });
  }
}
