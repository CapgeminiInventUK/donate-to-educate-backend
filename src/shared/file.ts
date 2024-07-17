import { unlinkSync } from 'fs';
import Zip from 'adm-zip';
import { parse } from 'csv-parse/sync';
import { logger } from './logger';

export const loadCsvDataFromZip = <T>(zipFile: string): T => {
  try {
    logger.info(`${zipFile}`);
    const zip = new Zip(zipFile);
    const csvAsbuffer: Buffer = zip.getEntries().map((item) => {
      const name = item.entryName;
      const file = zip.readFile(name);
      if (!file) {
        throw new Error('Could not read');
      }
      return file;
    })[0];

    return parse(csvAsbuffer, {
      columns: true,
      skip_empty_lines: true,
      bom: true,
    }) as T;
  } catch (error) {
    logger.error(error, 'There was a problem extracting from the zip file');
    throw error;
  } finally {
    unlinkSync(zipFile);
  }
};
