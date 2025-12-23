import {
  BadRequestException,
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
  if (error.code === '23505') throw new BadRequestException(error.detail);

  throw new InternalServerErrorException(
    'Unexpected error, check server logs!',
  );
}
