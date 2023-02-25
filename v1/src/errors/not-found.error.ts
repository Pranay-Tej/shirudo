import { STATUS_CODES } from '../types/status-codes';
import { CustomApiError } from './custom-api.error';

export class NotFoundError extends CustomApiError {
  constructor(entity: string = 'Entity') {
    super(`${entity} not found`);
    this.statusCode = STATUS_CODES.NOT_FOUND;
  }
}
