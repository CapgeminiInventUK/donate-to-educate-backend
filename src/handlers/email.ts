import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';
import { Handler } from 'aws-lambda';
import {
  AdditionalUser,
  ItemQuery,
  JoinRequest,
  LocalAuthorityRegisterRequest,
  LocalAuthorityUser,
} from '../../appsync';
import { logger } from '../shared/logger';
import { handleAdditionalUsers } from './email/additionalUsers';
import { handleItemQueries } from './email/itemQueries';
import { handleJoinRequests } from './email/joinRequests';
import { handleLocalAuthorityRegisterRequests } from './email/localAuthorityRegisterRequests';
import { handleNewLaUser } from './email/newLaUser';

const sesClient = new SESv2Client({ region: 'eu-west-2' });
const fromEmailAddress = 'team@donatetoeducate.org.uk';

interface MongoDBEvent {
  detail: {
    fullDocument:
      | LocalAuthorityUser
      | JoinRequest
      | ItemQuery
      | LocalAuthorityRegisterRequest
      | AdditionalUser;
    fullDocumentBeforeChange: JoinRequest | AdditionalUser;
    ns: { db: string; coll: string };
  };
}

export const handler: Handler = async (event: MongoDBEvent, context): Promise<void> => {
  logger.info(event);
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    // TODO add validation here
    if (!event?.detail?.fullDocument?.email && !event?.detail?.fullDocumentBeforeChange?.email) {
      logger.info('No email address provided');
      return;
    }

    const { fullDocument, ns, fullDocumentBeforeChange } = event.detail;

    switch (ns.coll) {
      case 'LocalAuthorityUser': {
        await handleNewLaUser(fullDocument as LocalAuthorityUser);
        break;
      }
      case 'JoinRequests': {
        await handleJoinRequests(
          fullDocument as JoinRequest,
          fullDocumentBeforeChange as JoinRequest
        );
        break;
      }
      case 'AdditionalUsers': {
        await handleAdditionalUsers(fullDocument as AdditionalUser);
        break;
      }
      case 'ItemQueries': {
        await handleItemQueries(fullDocument as ItemQuery);
        break;
      }
      case 'LocalAuthorityRegisterRequests': {
        handleLocalAuthorityRegisterRequests(fullDocument as LocalAuthorityRegisterRequest);
        break;
      }
      default:
        throw new Error(`Unexpected collection: ${event.detail.ns.coll}`);
    }
  } catch (error) {
    logger.error(error);
  }
};

export const sendEmail = async (
  email: string,
  templateName: string,
  templateData: Record<string, string>
): Promise<void> => {
  const res = await sesClient.send(
    new SendEmailCommand({
      FromEmailAddress: fromEmailAddress,
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
