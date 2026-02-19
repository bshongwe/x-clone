/**
 * Centralized error handling utilities for secure logging and user feedback
 * Prevents leaking sensitive information while maintaining debuggability
 */

import type { AxiosError } from "axios";

export interface AppError {
  message: string;
  code?: string;
  statusCode?: number;
  timestamp: string;
}

/**
 * Type guard for AxiosError
 */
function isAxiosError(error: unknown): error is AxiosError {
  return (error as AxiosError).isAxiosError === true;
}

/**
 * Type guard for standard Error
 */
function isError(error: unknown): error is Error {
  return error instanceof Error;
}

/**
 * Sanitizes error for client-side logging
 * Removes sensitive details while preserving debugging context
 */
export function sanitizeError(error: unknown): AppError {
  const timestamp = new Date().toISOString();

  if (isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>;
    return {
      message: axiosError.response?.data?.message || axiosError.message || "Network request failed",
      code: axiosError.code,
      statusCode: axiosError.response?.status,
      timestamp,
    };
  }

  if (isError(error)) {
    return {
      message: error.message,
      timestamp,
    };
  }

  return {
    message: "An unexpected error occurred",
    timestamp,
  };
}

/**
 * Logs error securely to console in development
 * In production, should be integrated with logging service (e.g., Sentry, LogRocket)
 */
export function logError(context: string, error: unknown): void {
  const sanitized = sanitizeError(error);
  const isDevelopment = globalThis.window?.location.hostname === "localhost";

  if (isDevelopment) {
    console.error(`[${context}]`, sanitized);
  } else {
    // Production: Only log sanitized error without sensitive details
    // Integrate with Sentry, LogRocket, or similar service here
    console.error(`[${context}]`, {
      message: sanitized.message,
      code: sanitized.code,
      timestamp: sanitized.timestamp,
    });
  }
}

/**
 * Gets user-friendly error message
 * Maps common errors to helpful messages
 */
export function getUserErrorMessage(error: unknown): string {
  const sanitized = sanitizeError(error);

  // Map common HTTP status codes to user-friendly messages
  switch (sanitized.statusCode) {
    case 400:
      return sanitized.message || "Invalid request. Please check your input.";
    case 401:
      return "You need to sign in to continue.";
    case 403:
      return "You don't have permission to perform this action.";
    case 404:
      return "The requested resource was not found.";
    case 409:
      return sanitized.message || "This action conflicts with existing data.";
    case 429:
      return "Too many requests. Please try again later.";
    case 500:
    case 502:
    case 503:
      return "Server error. Please try again later.";
    default:
      return sanitized.message || "Something went wrong. Please try again.";
  }
}

/**
 * Network error retry strategy
 */
export function shouldRetry(error: unknown, attemptNumber: number): boolean {
  const MAX_RETRIES = 3;

  if (attemptNumber >= MAX_RETRIES) {
    return false;
  }

  if (isAxiosError(error)) {
    const axiosError = error as AxiosError<unknown>;
    const status = axiosError.response?.status;

    // Retry on network errors or 5xx server errors
    if (!status || status >= 500) {
      return true;
    }

    // Retry on rate limiting with exponential backoff
    if (status === 429) {
      return true;
    }
  }

  return false;
}

/**
 * Calculate exponential backoff delay
 */
export function getRetryDelay(attemptNumber: number): number {
  const baseDelay = 1000; // 1 second
  return Math.min(baseDelay * Math.pow(2, attemptNumber), 10000); // Max 10 seconds
}
