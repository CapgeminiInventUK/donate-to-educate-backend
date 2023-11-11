import { readdirSync, rmSync, unlinkSync } from 'fs';
import { unzip } from './zip';
import { logger } from './logger';
import csv from 'csvtojson';
import { school_data_headers } from './globals';

export const loadCsvDataFromZip = async <T>(zipFile: string, extractPath: string): Promise<T> => {
  try {
    await unzip(zipFile, extractPath);

    const filename = readdirSync(extractPath).pop();
    const filepath = `${extractPath}/${filename}`;

    const data = await csv({
      trim: true,
      // noheader: false,
      headers: school_data_headers,
    }).fromFile(filepath);

    return data as T;
  } catch (error) {
    logger.error(error, 'There was a problem extracting from the zip file');
    throw error;
  } finally {
    unlinkSync(zipFile);
    rmSync(extractPath, { recursive: true, force: true });
  }
};