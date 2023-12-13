import { Handler } from 'aws-lambda';
import SESClient from 'aws-sdk/clients/sesv2';

const sesClient = new SESClient({ region: 'eu-west-2' });

export const handler: Handler = async (event, context, callback): Promise<void> => {
  // eslint-disable-next-line no-console
  console.log(event);
  try {
    const res = await sesClient
      .sendEmail({
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
      .promise();
    // eslint-disable-next-line no-console
    console.log(res);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }

  callback(null, 'Finished');
};
