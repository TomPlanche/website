type LogLevel = "debug" | "info" | "warn" | "error";

interface LoggerOptions {
	enabled?: boolean;
	prefix?: string;
	level?: LogLevel;
}

const LOG_LEVELS: Record<LogLevel, number> = {
	debug: 0,
	info: 1,
	warn: 2,
	error: 3,
};

export class Logger {
	private readonly enabled: boolean;
	private readonly prefix: string;
	private readonly minLevel: LogLevel;

	constructor(filePath: string, options: LoggerOptions = {}) {
		this.enabled = options.enabled ?? import.meta.env.DEV;
		this.prefix = options.prefix ?? this.formatFilePath(filePath);
		this.minLevel = options.level ?? "debug";
	}

	private formatFilePath(filePath: string): string {
		// Handle SvelteKit file paths
		return (
			filePath
				// Remove timestamp query parameter
				.replace(/\?t=\d+/, "")
				// Remove common prefixes
				.replace(/^.*?src\//, "")
				// Clean up route indicators
				.replace(/^\/?routes\//, "")
				// Remove file extensions
				.replace(/\.(ts|js|svelte)$/, "") ||
			// Handle empty paths
			"root"
		);
	}

	private shouldLog(level: LogLevel): boolean {
		return this.enabled && LOG_LEVELS[level] >= LOG_LEVELS[this.minLevel];
	}

	private formatMessage(message: string): string {
		return `[${this.prefix}] ${message}`;
	}

	debug(...args: any[]): void {
		if (this.shouldLog("debug")) {
			console.debug(this.formatMessage(args[0]), ...args.slice(1));
		}
	}

	info(...args: any[]): void {
		if (this.shouldLog("info")) {
			console.info(this.formatMessage(args[0]), ...args.slice(1));
		}
	}

	warn(...args: any[]): void {
		if (this.shouldLog("warn")) {
			console.warn(this.formatMessage(args[0]), ...args.slice(1));
		}
	}

	error(...args: any[]): void {
		if (this.shouldLog("error")) {
			console.error(this.formatMessage(args[0]), ...args.slice(1));
		}
	}
}

// Helper function to create logger instances
export function createLogger(
	filePath: string,
	options?: LoggerOptions,
): Logger {
	return new Logger(filePath, options);
}
