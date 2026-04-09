import { BaseResponse } from "..";
import { UserDTO } from "../../dtos/UserDTO";

export type RegisterResponse = UserDTO;
export type RegisterApiResponse = BaseResponse<RegisterResponse>;
