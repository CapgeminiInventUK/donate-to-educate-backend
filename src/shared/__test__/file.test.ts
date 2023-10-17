import { loadCsvDataFromZip } from '../file';
import { copyFile } from 'fs';
import expectedData from '../../../mockData/expected.json';

describe('File', () => {
  beforeEach(() => {
    copyFile('./mockData/extract.zip', './mockData/tmp/extract.zip', () => undefined);
  });

  it('check we can correctly extract data from csv and convert to json', async () => {
    const data = await loadCsvDataFromZip('./mockData/tmp/extract.zip', './mockData/tmp/extracted');

    expect(data).toEqual(expectedData);
  });
});
