import { STATUS_CODES } from '../types/status-codes';
import { CustomApiError } from './custom-api.error';

export class UnauthenticatedError extends CustomApiError {
  constructor(message: string = 'Invalid credentials') {
    super(message);
    this.statusCode = STATUS_CODES.UNAUTHORIZED;
  }
}
