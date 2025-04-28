/**
 * Standard API response format for success
 */
export interface ApiResponse<T> {
  /** The data returned by the API */
  data: T
  /** Indicates if the request was successful */
  success: true
}

/**
 * Standard API response format for errors
 */
export interface ApiErrorResponse {
  /** The error message */
  error: string
  /** Indicates that the request failed */
  success: false
}

/**
 * Union type for all API responses
 */
export type ApiResult<T> = ApiResponse<T> | ApiErrorResponse
