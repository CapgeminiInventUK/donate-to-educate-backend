import { readdirSync, rmSync, unlinkSync, readFileSync } from 'fs';
import { unzip } from './zip';
import { logger } from './logger';
import { ParseResult, parse } from 'papaparse';

export const loadCsvDataFromZip = async <T>(zipFile: string, extractPath: string): Promise<T> => {
  try {
    await unzip(zipFile, extractPath);

    const filename = readdirSync(extractPath).pop();
    const filepath = `${extractPath}/${filename}`;
    const file = readFileSync(filepath, { encoding: 'utf8' });

    const { data, errors } = await parseFile<ParseResult<string[]>>(file);
    if (errors.length > 0) {
      throw new Error(errors.join());
    }
    return data as T;
  } catch (error) {
    logger.error(error, 'There was a problem extracting from the zip file');
    throw error;
  } finally {
    unlinkSync(zipFile);
    rmSync(extractPath, { recursive: true, force: true });
  }
};

const parseFile = <T>(rawFile: string): Promise<T> => {
  return new Promise<T>((resolve) => {
    parse(rawFile, {
      delimiter: ',',
      complete: (results) => {
        resolve(results as T);
      },
      header: true,
    });
  });
};
