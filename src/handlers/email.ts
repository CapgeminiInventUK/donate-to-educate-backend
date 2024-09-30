import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';
import { Handler } from 'aws-lambda';
import {
  AdditionalUser,
  CharityProfile,
  CharityUser,
  ItemQuery,
  JoinRequest,
  LocalAuthorityRegisterRequest,
  LocalAuthorityUser,
  SchoolProfile,
  SchoolUser,
} from '../../appsync';
import { fullLogo, shortLogo } from '../shared/image';
import { logger } from '../shared/logger';
import { handleAdditionalUsers } from './email/additionalUsers';
import { handleDeleteCharityProfile } from './email/deleteCharityProfile';
import { handleDeleteCharityUser } from './email/deleteCharityUser';
import { handleDeleteLocalAuthorityUser } from './email/deleteLaUser';
import { handleDeleteSchoolProfile } from './email/deleteSchoolProfile';
import { handleDeleteSchoolUser } from './email/deleteSchoolUser';
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
      | CharityUser
      | SchoolUser
      | SchoolProfile
      | CharityProfile
      | AdditionalUser;
    fullDocumentBeforeChange:
      | JoinRequest
      | CharityUser
      | SchoolUser
      | SchoolProfile
      | LocalAuthorityUser
      | CharityProfile
      | AdditionalUser;
    ns: { db: string; coll: string };
  };
}

export const handler: Handler = async (event: MongoDBEvent, context): Promise<void> => {
  logger.info(event);
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const { fullDocument, ns, fullDocumentBeforeChange } = event.detail;

    switch (ns.coll) {
      case 'LocalAuthorityUser': {
        if (fullDocument) {
          await handleNewLaUser(fullDocument as LocalAuthorityUser);
        } else {
          await handleDeleteLocalAuthorityUser(fullDocumentBeforeChange as LocalAuthorityUser);
        }
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
        await handleLocalAuthorityRegisterRequests(fullDocument as LocalAuthorityRegisterRequest);
        break;
      }
      case 'CharityUser': {
        fullDocumentBeforeChange &&
          (await handleDeleteCharityUser(fullDocumentBeforeChange as CharityUser));
        break;
      }
      case 'SchoolUser': {
        fullDocumentBeforeChange &&
          (await handleDeleteSchoolUser(fullDocumentBeforeChange as SchoolUser));
        break;
      }
      case 'CharityProfile': {
        fullDocumentBeforeChange &&
          (await handleDeleteCharityProfile(fullDocumentBeforeChange as CharityProfile));
        break;
      }
      case 'SchoolProfile': {
        fullDocumentBeforeChange &&
          (await handleDeleteSchoolProfile(fullDocumentBeforeChange as SchoolProfile));
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
  logger.debug(
    `Sending email template ${templateName} to ${email} with data ${JSON.stringify(templateData)}`
  );

  const res = await sesClient.send(
    new SendEmailCommand({
      FromEmailAddress: fromEmailAddress,
      Destination: { ToAddresses: [email] },
      Content: {
        Template: {
          TemplateName: templateName,
          TemplateData: JSON.stringify({ ...templateData, fullLogo, shortLogo }),
        },
      },
    })
  );

  logger.info(res);
};
