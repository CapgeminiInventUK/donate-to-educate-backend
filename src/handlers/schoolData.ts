import chromium from '@sparticuz/chromium';
import fs from 'fs';
import unzipper from 'unzipper';
import csv from 'csvtojson';
const puppeteer = process.env.NODE_ENV === 'production' ? require('puppeteer-core') : require('puppeteer');

export const lambdaHandler = async (): Promise<{ statusCode: number }> => {
    const browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        ...(process.env.NODE_ENV === 'production' && { executablePath: await chromium.executablePath() }),
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
            (document.querySelector('#establishment-fields-csv-checkbox') as HTMLElement)?.click();
        });

        await page.waitForSelector('#download-selected-files-button');
        await page.evaluate(() => {
            (document.querySelector('#download-selected-files-button') as HTMLElement)?.click();
        });

        await page.waitForNavigation();

        await page.waitForSelector('#download-button');
        await page.evaluate(() => {
            (document.querySelector('#download-button') as HTMLElement)?.click();
        });

        await page.waitForNetworkIdle({ idleTime: 10000, timeout: 30000 });
    } catch (error) {
        console.log(error);
    } finally {
        page.close();
        browser.close();

        const readStream = fs.createReadStream('extract.zip');

        readStream.pipe(unzipper.Extract({ path: './extracted' }));

        readStream.on('end', async () => {
            try {
                const filename = fs.readdirSync('./extracted').pop();

                const data = (await csv().fromFile(`extracted/${filename}`)) as Record<string, string>[];
                const openSchools = data.filter(({ 'EstablishmentStatus (name)': status }) => status === 'Open');
                console.log(openSchools[0]);
            } catch (error) {
                console.log(error);
            } finally {
                fs.unlinkSync('extract.zip');
                fs.rmSync('extracted', { recursive: true, force: true });
            }
        });
    }

    return {
        statusCode: 200,
    };
};
