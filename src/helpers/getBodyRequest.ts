import { IncomingMessage } from 'node:http';

export const getRequestBodyData = (req: IncomingMessage) => {
  return new Promise((resolve) => {
    const body: Array<string> = [];

    req.on('data', (chunk) => {
      body.push(chunk.toString());
    });

    req.on('end', () => {
      try {
        resolve(JSON.parse(body.join('')));
      } catch (err) {
        resolve(null);
      }
    });
  });
};
