import { STATUS_CODES } from '../types/status-codes';

export class CustomApiError extends Error {
  statusCode?: number = STATUS_CODES.INTERNAL_SERVER_ERROR;
  constructor(message: string = 'Internal Server Error') {
    super(message);
    this.name = this.constructor.name;
  }
}
