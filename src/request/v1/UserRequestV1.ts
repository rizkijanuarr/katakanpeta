import { RoleEnum } from "../../utils";

export interface UserRequestV1 {
  name: string;
  email: string;
  password: string;
  role: RoleEnum;
}