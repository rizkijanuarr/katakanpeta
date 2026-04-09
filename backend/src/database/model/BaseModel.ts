export interface BaseModel {
  id?: string;
  active?: boolean;
  createdDate?: Date;
  modifiedDate?: Date | null;
  deletedDate?: Date | null;
  createdBy?: string;
  modifiedBy?: string | null;
  deletedBy?: string | null;
}
