import { NextRequest, NextResponse } from "next/server";
import { MiddlewareFactory, NextMiddlewareHandler } from "./types";

/**
 * Combines an array of MiddlewareFactory functions into a single NextMiddlewareHandler.
 * Middlewares execute in array order, supporting short-circuiting and response header mutation.
 */
export function chainMiddlewares(
  functions: MiddlewareFactory[] = [],
  index = 0
): NextMiddlewareHandler {
  const current = functions[index];

  if (current) {
    const next = chainMiddlewares(functions, index + 1);
    return current(next);
  }

  return (request: NextRequest) => {
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  };
}
