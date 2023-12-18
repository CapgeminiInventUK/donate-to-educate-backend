import { Handler } from 'aws-lambda';
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';
import { LocalAuthorityUser } from '../../appsync';

const sesClient = new SESv2Client({ region: 'eu-west-2' });

interface MongoDBEvent {
  detail: {
    fullDocument: LocalAuthorityUser;
  };
}

export const handler: Handler = async (event: MongoDBEvent, context, callback): Promise<void> => {
  // eslint-disable-next-line no-console
  console.log(event);

  try {
    // TODO add validation here
    if (event?.detail?.fullDocument?.email) {
      const { fullDocument } = event.detail;
      const { email, firstName } = fullDocument;

      const res = await sesClient.send(
        new SendEmailCommand({
          FromEmailAddress: email,
          Destination: { ToAddresses: [email] },
          Content: {
            Template: {
              TemplateName: 'Test',
              TemplateData: JSON.stringify({
                name: firstName,
                favoriteanimal: 'Tiger',
              }),
            },
          },
        })
      );

      // eslint-disable-next-line no-console
      console.log(res);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }

  callback(null, 'Finished');
};
