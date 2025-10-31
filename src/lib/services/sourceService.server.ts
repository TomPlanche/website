import { API_KEY } from "$env/static/private";
import { SourceService } from "./analytics";

/**
 * Singleton instance of SourceService for server-side use.
 *
 * This instance is initialized once with the API_KEY from the environment
 * and reused across all server-side operations. This eliminates the need
 * to instantiate SourceService multiple times throughout the application.
 *
 * Note: This file uses the .server.ts suffix to ensure it's only imported
 * in server-side code, as it accesses private environment variables.
 */
export const sourceService = new SourceService(API_KEY);
