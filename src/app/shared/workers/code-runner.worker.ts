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
  } catch (error: any) {
    postMessage({
      success: false,
      error: error?.message ?? String(error),
    });
  }
});
