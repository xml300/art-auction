import { NextFetchEvent, NextRequest } from "next/server";
import { MiddlewareFactory, NextMiddlewareHandler } from "./types";

export const withLogging: MiddlewareFactory = (next: NextMiddlewareHandler) => {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const start = Date.now();
    const response = await next(request, event);
    const duration = Date.now() - start;

    response.headers.set("X-Response-Time", `${duration}ms`);
    return response;
  };
};
