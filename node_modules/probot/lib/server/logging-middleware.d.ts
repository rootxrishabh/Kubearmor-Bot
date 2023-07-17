import pinoHttp from "pino-http";
import type { Logger } from "pino";
export declare function getLoggingMiddleware(logger: Logger, options?: pinoHttp.Options): pinoHttp.HttpLogger;
