import { BaseResponse, BaseErrorResponse } from "..";

export class ResponseHelper {
  static success<T>(message: string, data: T): BaseResponse<T> {
    return {
      success: true,
      message: message,
      data: data,
    };
  }
  static error(message: string): BaseErrorResponse {
    return {
      success: false,
      message: message,
    };
  }
}
