import { RegisterRequest } from "../../request";
import { RegisterApiResponse } from "../../response";

export interface RegisterService {
  register(request: RegisterRequest): Promise<RegisterApiResponse>;
}