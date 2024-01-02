import { Handler } from 'aws-lambda';
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';
import { JoinRequest, LocalAuthorityUser } from '../../appsync';

const sesClient = new SESv2Client({ region: 'eu-west-2' });

interface MongoDBEvent {
  detail: {
    fullDocument: LocalAuthorityUser | JoinRequest;
    ns: { db: string; coll: string };
  };
}

export const handler: Handler = async (event: MongoDBEvent, context, callback): Promise<void> => {
  // eslint-disable-next-line no-console
  console.log(event);

  try {
    // TODO add validation here
    if (!event?.detail?.fullDocument?.email) {
      // eslint-disable-next-line no-console
      console.log('No email address provided');
    }

    const { fullDocument, ns } = event.detail;

    switch (ns.coll) {
      case 'LocalAuthority':
        {
          // TODO need to add email template for this
          // const { email, firstName } = fullDocument as LocalAuthorityUser;
          // const res = await sesClient.send(
          //   new SendEmailCommand({
          //     FromEmailAddress: email,
          //     Destination: { ToAddresses: [email] },
          //     Content: {
          //       Template: {
          //         TemplateName: 'Test',
          //         TemplateData: JSON.stringify({
          //           subject: 'This is a test email',
          //           greeting: `Hello ${firstName}!`,
          //           body: 'This is a test! <p style="color: blue;">test!</p>',
          //         }),
          //       },
          //     },
          //   })
          // );
          // eslint-disable-next-line no-console
          // console.log(res);
        }
        break;
      case 'JoinRequests': {
        const { email, name, status } = fullDocument as JoinRequest;

        const res = await sesClient.send(
          new SendEmailCommand({
            FromEmailAddress: email,
            Destination: { ToAddresses: [email] },
            Content: {
              Template: {
                TemplateName:
                  status === 'APPROVED' ? 'join-request-approved' : 'join-request-declined',
                TemplateData: JSON.stringify({
                  subject: 'Your Donate to Educate application results',
                  name,
                }),
              },
            },
          })
        );

        // eslint-disable-next-line no-console
        console.log(res);
        break;
      }
      default:
        throw new Error(`Unexpected collection: ${event.detail.ns.coll}`);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }

  callback(null, 'Finished');
};
