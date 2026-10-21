/// <reference lib="webworker" />

addEventListener('message', (message: MessageEvent) => {
  const data = message.data as { code: string };
  try {
    const fn = new Function(data.code);
    const result = fn();
    postMessage({
      success: true,
      result,
    });
  } catch (error: unknown) {
    postMessage({
      success: false,
      error:
        typeof error === 'object' && error !== null && 'message' in error
          ? (error.message ?? String(error))
          : String(error),
    });
  }
});
