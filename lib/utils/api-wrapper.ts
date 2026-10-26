import { NextRequest, NextResponse } from "next/server";
import { AppError } from "./AppError";
import { logger } from "./logger";

type ApiHandler = (req: NextRequest, context: any) => Promise<Response>;

export function apiWrapper(handler: ApiHandler) {
  return async (req: NextRequest, context: any) => {
    const correlationId =
      req.headers.get("x-correlation-id") ||
      req.headers.get("x-request-id") ||
      `req-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    try {
      logger.info(`[API REQUEST] ${req.method} ${req.nextUrl.pathname}`, { correlationId }, correlationId);

      const response = await handler(req, context);

      // Ensure correlation ID is propagated on response headers
      if (response && response.headers && !response.headers.has("X-Correlation-ID")) {
        response.headers.set("X-Correlation-ID", correlationId);
      }

      return response;
    } catch (error: any) {
      logger.error(
        `[API ERROR] ${req.method} ${req.nextUrl.pathname}`,
        {
          message: error.message,
          stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
          statusCode: error instanceof AppError ? error.statusCode : 500,
          correlationId,
        },
        correlationId
      );

      if (error instanceof AppError) {
        const errRes = NextResponse.json(
          {
            success: false,
            error: error.message,
            correlationId,
          },
          { status: error.statusCode }
        );
        errRes.headers.set("X-Correlation-ID", correlationId);
        return errRes;
      }

      // Safe production error responses: never leak internal stack traces or DB errors
      const isProd = process.env.NODE_ENV === "production";
      const safeErrorMessage = isProd
        ? "An internal server error occurred. Please try again later."
        : error.message || "Internal Server Error";

      const errRes = NextResponse.json(
        {
          success: false,
          error: safeErrorMessage,
          correlationId,
        },
        { status: 500 }
      );
      errRes.headers.set("X-Correlation-ID", correlationId);
      return errRes;
    }
  };
}
