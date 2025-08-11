export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  QUOTA_EXCEEDED = 'QUOTA_EXCEEDED',
  SUBSCRIPTION_REQUIRED = 'SUBSCRIPTION_REQUIRED',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}

export class AppError extends Error {
  constructor(
    message: string,
    public code: ErrorCode,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'AppError';
  }
}