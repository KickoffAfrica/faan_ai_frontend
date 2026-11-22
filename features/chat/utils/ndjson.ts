export async function* readNdjsonStream<T>(
  body: ReadableStream<Uint8Array>
): AsyncGenerator<T> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      let newlineIndex = buffer.indexOf("\n");
      while (newlineIndex !== -1) {
        const line = buffer.slice(0, newlineIndex).trim();
        buffer = buffer.slice(newlineIndex + 1);
        if (line) yield JSON.parse(line) as T;
        newlineIndex = buffer.indexOf("\n");
      }
    }

    const remaining = buffer.trim();
    if (remaining) yield JSON.parse(remaining) as T;
  } finally {
    reader.releaseLock();
  }
}
