import { BaseModel } from "./BaseModel";

export interface ScrapeLogModel extends BaseModel {
  user_id: string;
  query: string;
  request_body: Record<string, any>;
  response_body: Record<string, any>;
}
