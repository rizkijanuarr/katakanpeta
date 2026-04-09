import { DateUtil } from "../utils/date/DateUtil";

export interface UserDTO {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
  createdDate: string | null;
  modifiedDate: string | null;
  deletedDate: string | null;
  createdBy: string;
  modifiedBy: string | null;
  deletedBy: string | null;
}

export const toUserDTO = (user: any): UserDTO => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    active: user.active,

    createdDate: DateUtil.format(user.createdDate, DateUtil.DATE_PATTERN_2),
    modifiedDate: DateUtil.format(user.modifiedDate, DateUtil.DATE_PATTERN_5),
    deletedDate: DateUtil.format(user.deletedDate, DateUtil.DATE_PATTERN_7),
    createdBy: user.createdBy,
    modifiedBy: user.modifiedBy || null,
    deletedBy: user.deletedBy || null
  };
};
