export type NextNavigationError = Error & { digest?: string };

function hasDigest(error: unknown): error is NextNavigationError {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    typeof (error as { digest?: unknown }).digest === "string"
  );
}

export function isNextRedirectError(error: unknown): error is NextNavigationError {
  return hasDigest(error) && error.digest.startsWith("NEXT_REDIRECT");
}

export function isNextNotFoundError(error: unknown): error is NextNavigationError {
  return hasDigest(error) && error.digest.startsWith("NEXT_NOT_FOUND");
}

/**
 * Next.js implements `redirect()` and `notFound()` by throwing special errors.
 * If you `catch` them, you break navigation.
 */
export function rethrowNextNavigationErrors(error: unknown): void {
  if (isNextRedirectError(error) || isNextNotFoundError(error)) {
    throw error;
  }
}
