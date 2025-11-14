import type {
  TGetSourcesResponse,
  TLogSourceResponse,
  TSources,
} from "$lib/types/";
import type { TApiSuccessResponse } from "$lib/types/back";
import { apiGet, apiPost } from "$lib/utils/api";

/**
 * SourceService handles all operations related to source logging and retrieval.
 *
 * By encapsulating the endpoint and API key as instance properties, we eliminate
 * the need to pass these common parameters to every method call. This follows
 * the principle of "Tell, Don't Ask" - the service knows how to talk to the API
 * without needing to be reminded of these details each time.
 */
export class SourceService {
  private readonly endpoint = "/secure/source";
  private readonly apiKey: string;

  /**
   * Creates a new SourceService instance.
   *
   * @param apiKey - The API key for authentication. This is stored once
   *                 and used for all subsequent API calls.
   */
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Logs a source to the API.
   *
   * @param source - The source to log.
   * @returns A promise that resolves to an object containing the logged source and its count.
   */
  async logSource(source: string): Promise<TLogSourceResponse> {
    const response = await apiPost<TApiSuccessResponse<TLogSourceResponse>>(
      this.endpoint,
      { source },
      this.apiKey,
    );

    return this.validateAndExtractData(response, "Failed to log source");
  }

  /**
   * Fetches all sources from the API.
   *
   * @returns A promise that resolves to an object containing sources and their counts.
   *          Returns an empty object if the request fails, ensuring the caller
   *          always gets a usable value.
   */
  async getSources(): Promise<TSources> {
    try {
      const response = await apiGet<TApiSuccessResponse<TGetSourcesResponse>>(
        this.endpoint,
        this.apiKey,
      );

      const data = this.validateAndExtractData(
        response,
        "Failed to fetch sources",
      );
      return data.sources;
    } catch (error) {
      console.error("Error fetching sources:", error);
      return {};
    }
  }

  /**
   * Helper method to validate API responses and extract data.
   * This centralizes our error handling logic and ensures consistent
   * behavior across all API operations.
   *
   * @param response - The API response to validate
   * @param errorMessage - The error message to use if validation fails
   * @returns The extracted data from the response
   * @throws Error if the response status is not 200
   */
  private validateAndExtractData<T>(
    response: { status: number; data: TApiSuccessResponse<T> },
    errorMessage: string,
  ): T {
    if (response.status !== 200) {
      console.error(errorMessage, response.data);
      throw new Error(errorMessage);
    }
    return response.data.data;
  }
}
