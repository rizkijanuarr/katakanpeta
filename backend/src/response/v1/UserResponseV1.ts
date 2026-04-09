import { UserDTO } from "../../dtos/UserDTO";
import { BaseResponse } from "../advices/BaseResponse";

export type UserResponseV1 = UserDTO;
export type UserApiResponse = BaseResponse<UserResponseV1>;
