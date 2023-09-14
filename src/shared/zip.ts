import { createReadStream } from 'fs';
import { Extract } from 'unzipper';

export const unzip = (zipFile: string, extractedPath: string): Promise<void> => {
  const readStream = createReadStream(zipFile);

  readStream.pipe(Extract({ path: extractedPath }));

  return new Promise<void>((resolve, reject) => {
    readStream.on('end', () => resolve());
    readStream.on('error', (error) => reject(error));
  });
};
