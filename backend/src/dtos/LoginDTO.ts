import { DateUtil } from "../utils/date/DateUtil";
import { UserDTO } from "./UserDTO";

export interface LoginDTO extends UserDTO {
    token: string;
  }

  export const toUserDTO = (user: any): UserDTO => {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      active: user.active,
      createdDate: DateUtil.format(user.createdDate),
      modifiedDate: DateUtil.format(user.modifiedDate),
      deletedDate: DateUtil.format(user.deletedDate),
      createdBy: user.createdBy,
      modifiedBy: user.modifiedBy || null,
      deletedBy: user.deletedBy || null
    };
  };

  export const toLoginDTO = (user: any, token: string): LoginDTO => {
    return {
      ...toUserDTO(user),
      token
    };
  };
