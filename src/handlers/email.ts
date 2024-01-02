import { Handler } from 'aws-lambda';
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';
import { JoinRequest, LocalAuthorityUser } from '../../appsync';
import { generate } from 'randomstring';
import { SignUpDataRepository } from '../repository/signUpDataRepository';
const sesClient = new SESv2Client({ region: 'eu-west-2' });

interface MongoDBEvent {
  detail: {
    fullDocument: LocalAuthorityUser | JoinRequest;
    ns: { db: string; coll: string };
  };
}

const signUpDataRepository = SignUpDataRepository.getInstance();

export const handler: Handler = async (event: MongoDBEvent, context, callback): Promise<void> => {
  // eslint-disable-next-line no-console
  console.log(event);

  try {
    // TODO add validation here
    if (!event?.detail?.fullDocument?.email) {
      // eslint-disable-next-line no-console
      console.log('No email address provided');
      callback('No email address provided', null);
      return;
    }

    const { fullDocument, ns } = event.detail;

    switch (ns.coll) {
      case 'LocalAuthority':
        {
          const randomString = generate({ charset: 'alphabetic', length: 50 });
          const { email } = fullDocument as LocalAuthorityUser;

          await signUpDataRepository.insert({ id: randomString, email });
          // TODO need to add email template for this

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

        await sendEmail(
          email,
          status === 'APPROVED' ? 'join-request-approved' : 'join-request-declined',
          {
            subject: 'Your Donate to Educate application results',
            name,
          }
        );
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

const sendEmail = async (
  email: string,
  templateName: string,
  templateData: Record<string, string>
): Promise<void> => {
  const res = await sesClient.send(
    new SendEmailCommand({
      FromEmailAddress: 'ryan.b.smith@capgemini.com', // TODO get from env vars
      Destination: { ToAddresses: [email] },
      Content: {
        Template: {
          TemplateName: templateName,
          TemplateData: JSON.stringify(templateData),
        },
      },
    })
  );

  // eslint-disable-next-line no-console
  console.log(res);
};
