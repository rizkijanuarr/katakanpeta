import { BaseModel } from "./BaseModel";

export interface UserModel extends BaseModel {
  name: string;
  email: string;
  password: string;
  role: string;
}
