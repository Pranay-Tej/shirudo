import { STATUS_CODES } from '../types/status-codes';
import { CustomApiError } from './custom-api.error';

export class BadRequestError extends CustomApiError {
  constructor(message: string = 'Bad Request') {
    super(message);
    this.statusCode = STATUS_CODES.BAD_REQUEST;
  }
}
