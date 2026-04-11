import { LoginDTO } from "../../dtos/LoginDTO";
import { BaseResponse } from "../advices/BaseResponse";

export type LoginResponse = LoginDTO;
export type LoginApiResponse = BaseResponse<LoginResponse>;
