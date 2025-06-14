export type TBackendResponse<T> = {
  success: boolean;
  status: number;
  data: T;
};
