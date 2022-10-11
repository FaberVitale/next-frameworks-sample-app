export function delay(delayMs: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(resolve, delayMs);

    signal?.addEventListener("abort", () => {
      reject();
      clearTimeout(timeout);
    });
  });
}
