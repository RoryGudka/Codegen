/**
 * A utility function that retries a function if it encounters a rate limit error.
 * When a rate limit error is encountered, it waits for 70 seconds (60 seconds + 10 extra seconds)
 * before retrying.
 *
 * @param fn The async function to execute and potentially retry
 * @param maxRetries Maximum number of retries (default: 3)
 * @returns The result of the function execution
 */
export async function retryWithRateLimit<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
): Promise<T> {
  let retries = 0;

  while (true) {
    try {
      return await fn();
    } catch (error: any) {
      // Check if this is a rate limit error
      const isRateLimitError =
        error.status === 429 ||
        (error.message &&
          typeof error.message === "string" &&
          error.message.includes("rate limit"));

      if (isRateLimitError && retries < maxRetries) {
        console.warn(
          `Rate limit exceeded. Waiting 70 seconds before retry (${retries + 1}/${maxRetries})...`,
        );
        // Wait for 70 seconds (60 seconds + 10 extra seconds)
        await new Promise((resolve) => setTimeout(resolve, 70000));
        retries++;
      } else {
        // If it's not a rate limit error or we've reached max retries, rethrow
        throw error;
      }
    }
  }
}
