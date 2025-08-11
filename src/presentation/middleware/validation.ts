import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { AppError, ErrorCode } from '../../shared/types/index';

export const validateBody = <T extends object>(DtoClass: new () => T) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = plainToClass(DtoClass, req.body);
      const errors = await validate(dto as object);

      if (errors.length > 0) {
        const errorMessages = errors.map(error => 
          Object.values(error.constraints || {}).join(', ')
        ).join('; ');

        throw new AppError(errorMessages, ErrorCode.VALIDATION_ERROR, 400);
      }

      req.body = dto;
      next();
    } catch (error) {
      next(error);
    }
  };
};