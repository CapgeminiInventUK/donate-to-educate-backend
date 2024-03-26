import { Handler } from 'aws-lambda';
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';
import {
  ItemQuery,
  JoinRequest,
  LocalAuthorityUser,
  LocalAuthorityRegisterRequest,
} from '../../appsync';
import { generate } from 'randomstring';
import { SignUpDataRepository } from '../repository/signUpDataRepository';
import { SchoolDataRepository } from '../repository/schoolDataRepository';
import { v4 as uuidv4 } from 'uuid';
import { CharityDataRepository } from '../repository/charityDataRepository';
import { logger } from '../shared/logger';
import { checkIfDefinedElseDefault } from '../shared/check';

const sesClient = new SESv2Client({ region: 'eu-west-2' });

interface MongoDBEvent {
  detail: {
    fullDocument: LocalAuthorityUser | JoinRequest | ItemQuery | LocalAuthorityRegisterRequest;
    fullDocumentBeforeChange: JoinRequest;
    ns: { db: string; coll: string };
  };
}

const signUpDataRepository = SignUpDataRepository.getInstance();
const schoolDataRepository = SchoolDataRepository.getInstance();
const charityDataRepository = CharityDataRepository.getInstance();

export const handler: Handler = async (event: MongoDBEvent, context, callback): Promise<void> => {
  logger.info(event);
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    // TODO add validation here
    if (!event?.detail?.fullDocument?.email && !event?.detail?.fullDocumentBeforeChange?.email) {
      logger.info('No email address provided');
      callback('No email address provided', null);
      return;
    }

    const { fullDocument, ns, fullDocumentBeforeChange } = event.detail;
    const domainName = checkIfDefinedElseDefault(process?.env?.DOMAIN_NAME);

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
          const randomString = generate({ charset: 'alphabetic', length: 100 });
          const {
            email,
            name,
            type,
            school,
            charityName,
            charityAddress,
            aboutCharity,
            localAuthority,
            urn,
          } = fullDocument as JoinRequest;

          if (type === 'school') {
            const schoolName = school?.split(' - ')[0];

            await signUpDataRepository.insert({
              id: randomString,
              email,
              type,
              name: checkIfDefinedElseDefault(schoolName),
              nameId: checkIfDefinedElseDefault(urn),
            });

            await schoolDataRepository.setToRegistered(
              checkIfDefinedElseDefault(schoolName),
              checkIfDefinedElseDefault(urn)
            );
          } else if (type === 'charity') {
            const charityId = uuidv4();
            await signUpDataRepository.insert({
              id: randomString,
              email,
              type,
              name: checkIfDefinedElseDefault(charityName),
              nameId: charityId,
            });

            await charityDataRepository.insert({
              id: charityId,
              name: checkIfDefinedElseDefault(charityName),
              address: checkIfDefinedElseDefault(charityAddress),
              about: checkIfDefinedElseDefault(aboutCharity),
              localAuthority,
            });
          } else {
            throw new Error(`Invalid type ${type}`);
          }

          await sendEmail(email, 'join-request-approved', {
            subject: 'Your Donate to Educate application results',
            name,
            signUpLink: `https://${domainName}/add-user?id=${randomString}`,
          });

          // TODO do something with la email sending
          // const la = await localAuthorityUserRepository.getByName(localAuthority);

          // await sendEmail(checkIfDefinedElseDefault(la?.email), 'reviewed-requests-to-join', {
          //   subject: "We've reviewed your requests to join",
          //   reviewLink: `https://${domainName}/login`,
          // });
        } else {
          const { email, name } = fullDocumentBeforeChange;

          await sendEmail(email, 'join-request-declined', {
            subject: 'Your Donate to Educate application results',
            name,
          });

          // TODO do something with la email sending
          // const la = await localAuthorityUserRepository.getByName(localAuthority);

          // await sendEmail(checkIfDefinedElseDefault(la?.email), 'reviewed-requests-to-join', {
          //   subject: "We've reviewed your requests to join",
          //   reviewLink: `https://${domainName}/login`,
          // });
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
      case 'LocalAuthorityRegisterRequests': {
        const { name, email, localAuthority, message, type } =
          fullDocument as LocalAuthorityRegisterRequest;

        await sendEmail('ryan.b.smith@capgemini.com', 'la-not-joined', {
          type,
          subject: 'Local authority has not joined',
          email,
          name,
          localAuthority,
          message,
        });

        break;
      }

      default:
        throw new Error(`Unexpected collection: ${event.detail.ns.coll}`);
    }
  } catch (error) {
    logger.error(error);
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

  logger.info(res);
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
