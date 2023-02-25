export interface FetchConfig {
  method: string;
  path: string;
  data?: object | null;
  isBasic?: boolean;
  token?: string;
  type?: string;
  params?: { [key: string]: any };
}
export interface ResStatus {
  code: string;
  message: string;
}
