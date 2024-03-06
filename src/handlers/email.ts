import { Handler } from 'aws-lambda';
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';
import { ItemQuery, JoinRequest, LocalAuthorityUser } from '../../appsync';
import { generate } from 'randomstring';
import { SignUpDataRepository } from '../repository/signUpDataRepository';
import { LocalAuthorityUserRepository } from '../repository/localAuthorityUserRepository';

const sesClient = new SESv2Client({ region: 'eu-west-2' });

interface MongoDBEvent {
  detail: {
    fullDocument: LocalAuthorityUser | JoinRequest | ItemQuery;
    fullDocumentBeforeChange: JoinRequest;
    ns: { db: string; coll: string };
  };
}

const signUpDataRepository = SignUpDataRepository.getInstance();
const localAuthorityUserRepository = LocalAuthorityUserRepository.getInstance();

export const handler: Handler = async (event: MongoDBEvent, context, callback): Promise<void> => {
  // eslint-disable-next-line no-console
  console.log(event);
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    // TODO add validation here
    if (!event?.detail?.fullDocument?.email && !event?.detail?.fullDocumentBeforeChange?.email) {
      // eslint-disable-next-line no-console
      console.log('No email address provided');
      callback('No email address provided', null);
      return;
    }

    const { fullDocument, ns, fullDocumentBeforeChange } = event.detail;
    const domainName = process.env.DOMAIN_NAME ?? '';

    switch (ns.coll) {
      case 'LocalAuthorityUser': {
        const randomString = generate({ charset: 'alphabetic', length: 100 });
        const { email, firstName, name, nameId } = fullDocument as LocalAuthorityUser;

        await signUpDataRepository.insert({
          id: randomString,
          email,
          type: 'localAuthority',
          name,
          nameId,
        });

        await sendEmail(email, 'create-account-la', {
          subject: 'Complete your sign up to Donate to Educate',
          name: firstName,
          la: name,
          signUpLink: `https://${domainName}/add-user?id=${randomString}`,
        });
        break;
      }

      case 'JoinRequests': {
        if (fullDocument) {
          const { email, name, localAuthority } = fullDocument as JoinRequest;

          await sendEmail(email, 'join-request-approved', {
            subject: 'Your Donate to Educate application results',
            name,
          });

          const la = await localAuthorityUserRepository.getByName(localAuthority);

          await sendEmail(la?.email ?? '', 'reviewed-requests-to-join', {
            subject: "We've reviewed your requests to join",
            reviewLink: `https://${domainName}/login`,
          });
        } else {
          const { email, name, localAuthority } = fullDocumentBeforeChange;

          await sendEmail(email, 'join-request-declined', {
            subject: 'Your Donate to Educate application results',
            name,
          });

          const la = await localAuthorityUserRepository.getByName(localAuthority);

          await sendEmail(la?.email ?? '', 'reviewed-requests-to-join', {
            subject: "We've reviewed your requests to join",
            reviewLink: `https://${domainName}/login`,
          });
        }
        break;
      }
      case 'ItemQueries': {
        const { email, name, type, message, who, phone, connection } = fullDocument as ItemQuery;
        const { subject, intro } = getContentFromType(type);

        await sendEmail('ryan.b.smith@capgemini.com', 'request', {
          subject,
          intro,
          type: who,
          email,
          phone,
          message,
          name,
          ...(connection && { connection }),
        });
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

const getContentFromType = (type: string): { subject: string; intro: string } => {
  switch (type) {
    case 'tick':
      return {
        subject: 'Product request',
        intro: 'Someone has requested products from your school.',
      };
    case 'heart':
      return {
        subject: 'Donation request',
        intro: 'Someone wants to donate products to your school.',
      };
    case 'plus':
      return {
        subject: 'Excess product assistance',
        intro: 'Someone wants to help you with the extra stock at your school.',
      };
    default:
      throw new Error(`Unknown type ${type}`);
  }
};
