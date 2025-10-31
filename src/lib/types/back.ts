/**
 * Standard success response from the API
 * HTTP status codes are in response headers, not the body
 */
export type TApiSuccessResponse<T> = {
  data: T;
};

/**
 * Standard error response from the API
 */
export type TApiErrorResponse = {
  error: {
    message: string;
  };
};

/**
 * Pagination metadata for list endpoints
 */
export type TPaginationMetadata = {
  page: number;
  limit: number;
  pageCount: number;
  totalPages: number;
  totalCount: number;
  _links: {
    self: string;
    next?: string;
    prev?: string;
  };
};

/**
 * Paginated response from the API
 */
export type TApiPaginatedResponse<T> = {
  _metadata: TPaginationMetadata;
  data: T;
};

/**
 * Union type for all possible API responses
 */
export type TApiResponse<T> = TApiSuccessResponse<T> | TApiErrorResponse;

/**
 * Type guard to check if response is an error
 */
export const isApiError = (
  response: TApiResponse<unknown>,
): response is TApiErrorResponse => {
  return "error" in response;
};

/**
 * Type guard to check if response is paginated
 */
export const isApiPaginated = <T>(
  response: TApiSuccessResponse<T>,
): response is TApiPaginatedResponse<T> => {
  return "_metadata" in response;
};
