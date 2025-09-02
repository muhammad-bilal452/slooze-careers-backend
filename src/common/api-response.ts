export class ApiResponse<T> {
  status: string;
  message: string;
  data?: T;

  constructor(status: string, message: string, data?: T) {
    this.status = status;
    this.message = message;
    this.data = data;
  }

  static success<T>(data: T, message = 'Success'): ApiResponse<T> {
    return new ApiResponse<T>('success', message, data);
  }

  static error(message: string): ApiResponse<null> {
    return new ApiResponse<null>('error', message, null);
  }
}
