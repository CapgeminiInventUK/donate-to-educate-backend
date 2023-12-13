import { Handler } from 'aws-lambda';
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';

const sesClient = new SESv2Client({ region: 'eu-west-2' });

export const handler: Handler = async (event, context, callback): Promise<void> => {
  // eslint-disable-next-line no-console
  console.log(event);
  try {
    const res = await sesClient.send(
      new SendEmailCommand({
        FromEmailAddress: 'ryan.b.smith@capgemini.com',
        Destination: { ToAddresses: ['ryan.b.smith@capgemini.com'] },
        Content: {
          Template: {
            TemplateName: 'Test',
            TemplateData: JSON.stringify({
              name: 'Ryan',
              favoriteanimal: 'Tiger',
            }),
          },
        },
      })
    );

    // eslint-disable-next-line no-console
    console.log(res);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }

  callback(null, 'Finished');
};
