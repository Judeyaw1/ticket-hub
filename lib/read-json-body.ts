export async function readJsonBody(request: any) {
  if (request.body && typeof request.body === 'object') {
    return request.body;
  }

  if (typeof request.body === 'string') {
    return request.body ? JSON.parse(request.body) : {};
  }

  if (typeof request.on !== 'function') {
    return {};
  }

  const chunks: Uint8Array[] = await new Promise((resolve, reject) => {
    const parts: Uint8Array[] = [];

    request.on('data', (chunk: Uint8Array) => {
      parts.push(chunk);
    });

    request.on('end', () => resolve(parts));
    request.on('error', reject);
  });

  if (chunks.length === 0) {
    return {};
  }

  const text = Buffer.concat(chunks).toString('utf8');
  return text ? JSON.parse(text) : {};
}
