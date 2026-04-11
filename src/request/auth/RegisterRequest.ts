import { RoleEnum } from "../../utils";

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: RoleEnum;
}