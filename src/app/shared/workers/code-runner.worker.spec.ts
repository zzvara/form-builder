describe('code-runner worker', () => {
  async function run(
    code: string,
  ): Promise<{ success: boolean; result?: unknown; error?: string }> {
    const worker = new Worker(new URL('./code-runner.worker', import.meta.url), { type: 'module' });
    try {
      return await new Promise((resolve, reject) => {
        worker.onmessage = (event) => resolve(event.data);
        worker.onerror = (event) => reject(new Error(event.message));
        worker.postMessage({ code });
      });
    } finally {
      worker.terminate();
    }
  }

  it('returns evaluated code results', async () => {
    expect(await run('return 2 + 3 === 5;')).toEqual({ success: true, result: true });
  });

  it('reports runtime and syntax failures without crashing the worker', async () => {
    expect(await run('throw new Error("bad answer");')).toEqual({
      success: false,
      error: 'bad answer',
    });
    expect((await run('return ;;; ???')).success).toBeFalse();
  });

  it('reports errors thrown as strings', async () => {
    expect(await run('throw "failure";')).toEqual({ success: false, error: 'failure' });
  });
});
