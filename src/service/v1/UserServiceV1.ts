import { UserRequestV1 } from "../../request";
import { ListUserResponseV1, UserApiResponse, UserResponseV1 } from "../../response";

export interface UserServiceV1 {
  createUser(request: UserRequestV1): Promise<UserApiResponse>;
  getAllUsers(): Promise<ListUserResponseV1>;
  getUserById(id: string): Promise<UserApiResponse>;
  updateUser(id: string, request: UserRequestV1): Promise<UserApiResponse>;
  deleteUser(id: string): Promise<{ message: string }>;
}
