import { ZodIssue } from 'zod';
import ErrorResponse from './ErrorResponse';

export class BadRequestErrorResponse implements ErrorResponse {
  errorMessage?;

  stack?;

  constructor(data: { message: string, issues: string | ZodIssue[] }) {
    this.stack = data.issues;
    this.errorMessage = data.message;
  }
  
}