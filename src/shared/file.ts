import { readdirSync, rmSync, unlinkSync } from 'fs';
import { unzip } from './zip';
import csv from 'csvtojson';

export const loadCsvDataFromZip = async <T>(zipFile: string) => {
    const extractPath = './extracted';

    try {
        await unzip(zipFile, extractPath);

        const filename = readdirSync(extractPath).pop();

        const data = (await csv().fromFile(`${extractPath}/${filename}`)) as T;
        return data;
    } catch (error) {
        console.log(error);
    } finally {
        unlinkSync(zipFile);
        rmSync(extractPath, { recursive: true, force: true });
    }

    return [];
};
