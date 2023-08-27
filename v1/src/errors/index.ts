import { BadRequestError } from './bad-request.error';
import { CustomApiError } from './custom-api.error';
import { ForbiddenError } from './forbidden.error';
import { NotFoundError } from './not-found.error';
import { UnauthenticatedError } from './unathenticated.error';

export const CustomErrors = {
  NotFoundError,
  CustomApiError,
  BadRequestError,
  UnauthenticatedError,
  ForbiddenError
};
