/// <reference types="node" />
/// <reference types="pino-http" />
import { Server as HttpServer } from "http";
import { Application } from "express";
import { Logger } from "pino";
import { ApplicationFunction, ServerOptions } from "../types";
import { Probot } from "../";
export declare class Server {
    static version: string;
    expressApp: Application;
    log: Logger;
    version: string;
    probotApp: Probot;
    private state;
    constructor(options?: ServerOptions);
    load(appFn: ApplicationFunction): Promise<void>;
    start(): Promise<HttpServer<typeof import("http").IncomingMessage, typeof import("http").ServerResponse>>;
    stop(): Promise<unknown>;
    router(path?: string): import("express-serve-static-core").Router;
}
