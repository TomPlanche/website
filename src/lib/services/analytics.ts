import type {
  TGetSourcesResponse,
  TLogSourceResponse,
  TSources,
} from "$lib/types/";
import type { TApiSuccessResponse } from "$lib/types/back";
import { apiGet, apiPost } from "$lib/utils/api";

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
  const response = await apiPost<TApiSuccessResponse<TLogSourceResponse>>(
    "/secure/source",
    { source },
    apiKey,
  );

  // HTTP status is now in headers only
  if (response.status !== 200) {
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
  try {
    const response = await apiGet<TApiSuccessResponse<TGetSourcesResponse>>(
      "/source",
      apiKey,
    );

    // HTTP status is now in headers only
    if (response.status !== 200) {
      console.error("Failed to fetch sources:", response.data);
      return {};
    }

    return response.data.data.sources;
  } catch (error) {
    console.error("Error fetching sources:", error);
    return {};
  }
};
