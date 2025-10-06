import { PUBLIC_API_ENDPOINT } from "$env/static/public";
import axios, { type AxiosInstance } from "axios";

/**
 * Creates an authenticated axios instance with the provided API key.
 *
 * @param apiKey {string} - The API key for authentication.
 *
 * @return {AxiosInstance} - An axios instance configured with auth headers.
 */
export const createAuthenticatedAxios = (apiKey: string): AxiosInstance => {
  return axios.create({
    baseURL: PUBLIC_API_ENDPOINT,
    headers: {
      "x-api-key": `${apiKey}`,
      "Content-Type": "application/json",
    },
  });
};


