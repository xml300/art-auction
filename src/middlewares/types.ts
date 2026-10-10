import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

export type NextMiddlewareHandler = (
  request: NextRequest,
  event: NextFetchEvent
) => Promise<NextResponse> | NextResponse;

export type MiddlewareFactory = (
  next: NextMiddlewareHandler
) => NextMiddlewareHandler;
