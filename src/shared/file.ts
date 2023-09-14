import { readdirSync, rmSync, unlinkSync } from 'fs';
import { unzip } from './zip';
import csv from 'csvtojson';
import { logger } from './logger';

export const loadCsvDataFromZip = async <T>(zipFile: string): Promise<T> => {
  const extractPath = './extracted';

  try {
    await unzip(zipFile, extractPath);

    const filename = readdirSync(extractPath).pop();

    const data = (await csv().fromFile(`${extractPath}/${filename}`)) as T;
    return data;
  } catch (error) {
    logger.error(error);
  } finally {
    unlinkSync(zipFile);
    rmSync(extractPath, { recursive: true, force: true });
  }

  return [] as T;
};
