export type IResponseData<T = any> = {
  code?: number;
  message?: string;
  data: T;
};
