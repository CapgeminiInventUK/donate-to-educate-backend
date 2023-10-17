import chromium from '@sparticuz/chromium-min';
import puppeteer from 'puppeteer-core';
import { logger } from './logger';
import os from 'os';

export const downloadSchoolDataFileLocally = async (): Promise<void> => {
  const browser = await puppeteer.launch({
    args: [...chromium.args, '--hide-scrollbars', '--disable-web-security'],
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(
      `https://github.com/Sparticuz/chromium/releases/download/v117.0.0/chromium-v117.0.0-pack.tar`
    ),
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  });

  const [page] = await browser.pages();
  const client = await page.target().createCDPSession();
  await client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: `${os.tmpdir()}/`,
  });

  try {
    await page.goto('https://get-information-schools.service.gov.uk/Downloads');

    await page.waitForSelector('#establishment-fields-csv-checkbox');
    await page.evaluate(() => {
      const element = document.querySelector('#establishment-fields-csv-checkbox');
      if (element instanceof HTMLElement) {
        element.click();
      }
    });

    await page.waitForSelector('#download-selected-files-button');
    await page.evaluate(() => {
      const element = document.querySelector('#download-selected-files-button');
      if (element instanceof HTMLElement) {
        element.click();
      }
    });

    await page.waitForNavigation();

    await page.waitForSelector('#download-button');
    await page.evaluate(() => {
      const element = document.querySelector('#download-button');
      if (element instanceof HTMLElement) {
        element.click();
      }
    });

    await page.waitForNetworkIdle({ idleTime: 10000, timeout: 30000 });
  } catch (error) {
    logger.error(error);
    throw error;
  } finally {
    await page.close();
    await browser.close();
  }
};
