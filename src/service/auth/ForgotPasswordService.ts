import { BaseResponse } from "../../response";

export interface ForgotPasswordRequest {
  email: string;
  newPassword?: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export type ForgotPasswordApiResponse = BaseResponse<ForgotPasswordResponse>;

export interface ForgotPasswordService {
  initiateReset(request: ForgotPasswordRequest): Promise<ForgotPasswordApiResponse>;
}
