import type { TGetSourcesResponse, TLogSourceResponse, TSources, } from "$lib/types/";
import type { TBackendResponse } from "$lib/types/back";
import { createAuthenticatedAxios } from "$lib/utils/http";
import type { AxiosResponse } from "axios";

/**
 * Logs the source to the API.
 *
 * @param source {string} - The source to log.
 * @param apiKey {string} - The API key for authentication.
 *
 * @return {Promise<TLogSourceResponse>} - A promise that resolves to an object containing the logged source and its count.
 */
export const logSource = async (
  source: string,
  apiKey: string,
): Promise<TLogSourceResponse> => {
  const authenticatedAxios = createAuthenticatedAxios(apiKey);

  const response: AxiosResponse<TBackendResponse<TLogSourceResponse>> =
    await authenticatedAxios.post("/source", { source });

  if (response.status !== 200 || !response.data.success) {
    console.error("Failed to log source:", response.data);

    throw new Error("Failed to log source");
  }

  return response.data.data;
};

/**
 * Fetches the sources from the API.
 *
 * @param apiKey {string} - The API key for authentication.
 *
 * @return {Promise<TSources>} - A promise that resolves to an object containing sources and their counts.
 */
export const getSources = async (apiKey: string): Promise<TSources> => {
  const authenticatedAxios = createAuthenticatedAxios(apiKey);

  const response: AxiosResponse<TBackendResponse<TGetSourcesResponse>> =
    await authenticatedAxios.get("/source");

  if (response.status !== 200 || !response.data.success) {
    console.error("Failed to fetch sources:", response.data);
    return {};
  }

  return response.data.data.sources;
};
