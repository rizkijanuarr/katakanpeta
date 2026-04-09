import { LoginRequest } from "../../request";
import { LoginApiResponse } from "../../response";

export interface LoginService {
  login(request: LoginRequest): Promise<LoginApiResponse>;
}