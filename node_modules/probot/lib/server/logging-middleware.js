"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLoggingMiddleware = void 0;
const pino_http_1 = __importDefault(require("pino-http"));
const uuid_1 = require("uuid");
function getLoggingMiddleware(logger, options) {
    return (0, pino_http_1.default)({
        ...options,
        logger: logger.child({ name: "http" }),
        customSuccessMessage(res) {
            const responseTime = Date.now() - res[pino_http_1.default.startTime];
            // @ts-ignore
            return `${res.req.method} ${res.req.url} ${res.statusCode} - ${responseTime}ms`;
        },
        customErrorMessage(err, res) {
            const responseTime = Date.now() - res[pino_http_1.default.startTime];
            // @ts-ignore
            return `${res.req.method} ${res.req.url} ${res.statusCode} - ${responseTime}ms`;
        },
        genReqId: (req) => req.headers["x-request-id"] ||
            req.headers["x-github-delivery"] ||
            (0, uuid_1.v4)(),
    });
}
exports.getLoggingMiddleware = getLoggingMiddleware;
//# sourceMappingURL=logging-middleware.js.map