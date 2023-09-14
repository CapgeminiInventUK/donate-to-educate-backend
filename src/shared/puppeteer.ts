// const puppeteer: PuppeteerNode =
//   process.env.NODE_ENV === 'production' ? require('puppeteer-core') : require('puppeteer');
import puppeteer from 'puppeteer';
import chromium from '@sparticuz/chromium';
import { logger } from './logger';

export const downloadSchoolDataFileLocally = async (): Promise<void> => {
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    ...(process.env.NODE_ENV === 'production' && {
      executablePath: await chromium.executablePath(),
    }),
    headless: chromium.headless,
  });
  const [page] = await browser.pages();
  const client = await page.target().createCDPSession();
  await client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: './',
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
  } finally {
    await page.close();
    await browser.close();
  }
};
