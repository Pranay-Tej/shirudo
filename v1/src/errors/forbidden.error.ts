import { STATUS_CODES } from '../types/status-codes';
import { CustomApiError } from './custom-api.error';

export class ForbiddenError extends CustomApiError {
  constructor(message: string = 'Forbidden access') {
    super(message);
    this.statusCode = STATUS_CODES.FORBIDDEN;
  }
}
