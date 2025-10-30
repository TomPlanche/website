import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";
import { PUBLIC_API_ENDPOINT } from "$env/static/public";

/**
 * Creates axios config with common headers including API key if provided
 */
const createConfig = (
  apiKey?: string,
  config?: AxiosRequestConfig,
): AxiosRequestConfig => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Merge existing headers if provided
  if (config?.headers) {
    Object.entries(config.headers).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        headers[key] = String(value);
      }
    });
  }

  if (apiKey) {
    headers["x-api-key"] = apiKey;
  }

  return {
    ...config,
    headers,
  };
};

/**
 * Handles axios errors safely, avoiding circular reference issues
 */
const handleAxiosError = (error: unknown, operation: string): never => {
  if (axios.isAxiosError(error)) {
    const errorDetails = {
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
    };
    console.error(`API ${operation} failed:`, errorDetails);

    throw new Error(
      `${operation} failed: ${error.response?.status || "Network error"} - ${error.message}`,
    );
  }

  const message = error instanceof Error ? error.message : "Unknown error";
  console.error(`Unexpected error during ${operation}:`, message);
  throw new Error(`${operation} failed: ${message}`);
};

/**
 * Makes a GET request to the API
 *
 * @param endpoint - API endpoint path (relative to PUBLIC_API_ENDPOINT)
 * @param apiKey - Optional API key for authentication
 * @param config - Optional axios config
 */
export const apiGet = async <T>(
  endpoint: string,
  apiKey?: string,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> => {
  try {
    const url = `${PUBLIC_API_ENDPOINT}${endpoint}`;
    return await axios.get<T>(url, createConfig(apiKey, config));
  } catch (error) {
    return handleAxiosError(error, `GET ${endpoint}`);
  }
};

/**
 * Makes a POST request to the API
 *
 * @param endpoint - API endpoint path (relative to PUBLIC_API_ENDPOINT)
 * @param data - Request body data
 * @param apiKey - Optional API key for authentication
 * @param config - Optional axios config
 */
export const apiPost = async <T, D = unknown>(
  endpoint: string,
  data: D,
  apiKey?: string,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> => {
  try {
    const url = `${PUBLIC_API_ENDPOINT}${endpoint}`;
    return await axios.post<T>(url, data, createConfig(apiKey, config));
  } catch (error) {
    return handleAxiosError(error, `POST ${endpoint}`);
  }
};

/**
 * Makes a PUT request to the API
 *
 * @param endpoint - API endpoint path (relative to PUBLIC_API_ENDPOINT)
 * @param data - Request body data
 * @param apiKey - Optional API key for authentication
 * @param config - Optional axios config
 */
export const apiPut = async <T, D = unknown>(
  endpoint: string,
  data: D,
  apiKey?: string,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> => {
  try {
    const url = `${PUBLIC_API_ENDPOINT}${endpoint}`;
    return await axios.put<T>(url, data, createConfig(apiKey, config));
  } catch (error) {
    return handleAxiosError(error, `PUT ${endpoint}`);
  }
};

/**
 * Makes a PATCH request to the API
 *
 * @param endpoint - API endpoint path (relative to PUBLIC_API_ENDPOINT)
 * @param data - Request body data
 * @param apiKey - Optional API key for authentication
 * @param config - Optional axios config
 */
export const apiPatch = async <T, D = unknown>(
  endpoint: string,
  data: D,
  apiKey?: string,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> => {
  try {
    const url = `${PUBLIC_API_ENDPOINT}${endpoint}`;
    return await axios.patch<T>(url, data, createConfig(apiKey, config));
  } catch (error) {
    return handleAxiosError(error, `PATCH ${endpoint}`);
  }
};

/**
 * Makes a DELETE request to the API
 *
 * @param endpoint - API endpoint path (relative to PUBLIC_API_ENDPOINT)
 * @param apiKey - Optional API key for authentication
 * @param config - Optional axios config
 */
export const apiDelete = async <T>(
  endpoint: string,
  apiKey?: string,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> => {
  try {
    const url = `${PUBLIC_API_ENDPOINT}${endpoint}`;
    return await axios.delete<T>(url, createConfig(apiKey, config));
  } catch (error) {
    return handleAxiosError(error, `DELETE ${endpoint}`);
  }
};
