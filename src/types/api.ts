export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export interface NestJsErrorResponse {
  statusCode: number;
  message: string | string[];
  error?: string;
}

export interface SuccessResponse {
  success: boolean;
}
