import { readdirSync, unlinkSync, readFileSync } from 'fs';
import { unzip } from './zip';
import { logger } from './logger';
import csv from 'csvtojson';
import { school_data_headers } from './globals';
import { parse } from 'csv-parse/sync';

export const loadCsvDataFromZip = async <T>(zipFile: string, extractPath: string): Promise<T> => {
  try {
    await unzip(zipFile, extractPath);

    const filename = readdirSync(extractPath).pop();
    const filepath = `${extractPath}/${filename}`;
    const file = readFileSync(filepath);

    const data = await csv({
      trim: true,
      // noheader: false,
      headers: school_data_headers,
    }).fromFile(filepath);

    const data2 = parse(file, {
      columns: true,
      skip_empty_lines: true,
      bom: true,
      quote: '"',
      delimiter: ',',
      rtrim: true,
      ltrim: true,
      trim: true,
      relax_quotes: true,
    }) as T;
    logger.info(data2);

    return data as T;
  } catch (error) {
    logger.error(error, 'There was a problem extracting from the zip file');
    throw error;
  } finally {
    unlinkSync(zipFile);
    //rmSync(extractPath, { recursive: true, force: true });
  }
};
