import {
  ConflictException,
  HttpException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

export function handleDBExceptions(error: any, logger: Logger) {
  logger.error(error);
  if (error instanceof HttpException) {
    throw error;
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (error.code === '23505') throw new ConflictException(error.detail);

  // TODO: Eventualmente, se deberán agregar códigos adicionales, como el 23502 (NOT NULL) y 23503 (FK). Detalles: https://www.postgresql.org/docs/current/errcodes-appendix.html

  throw new InternalServerErrorException(
    'Unexpected error, check server logs!',
  );
}
