import { UserResponseV1 } from "..";

export interface ListUserResponseV1 {
  success: boolean;
  message: string;
  data: UserResponseV1[];
}