import { ItemQuery } from '../../../appsync';
import { CharityUserRepository } from '../../repository/charityUserRepository';
import { SchoolUserRepository } from '../../repository/schoolUserRepository';
import { logger } from '../../shared/logger';
import { sendEmail } from '../email';

const charityUserRepository = CharityUserRepository.getInstance();
const schoolUserRepository = SchoolUserRepository.getInstance();

export const handleItemQueries = async (fullDocument: ItemQuery) => {
  const {
    email,
    name,
    type,
    message,
    who,
    phone,
    connection,
    organisationId,
    organisationName,
    organisationType,
  } = fullDocument;
  const { subject, intro } = getContentFromType(type, organisationType);

  const user =
    organisationType === 'school'
      ? await schoolUserRepository.get(organisationName, organisationId)
      : await charityUserRepository.get(organisationName, organisationId);

  if (user?.email) {
    await sendEmail(user?.email, 'request', {
      subject,
      intro,
      type: getWhoFromValue(who),
      email,
      phone,
      message,
      name,
      ...(connection && { connection }),
    });
  } else {
    logger.info(`Invalid email: ${user?.email}`);
  }
};

const getContentFromType = (
  type: string,
  organisationType: string
): { subject: string; intro: string } => {
  switch (type) {
    case 'tick':
      return {
        subject: 'Product request',
        intro: `Someone has requested products from your ${organisationType}.`,
      };
    case 'heart':
      return {
        subject: 'Donation request',
        intro: `Someone wants to donate products to your ${organisationType}.`,
      };
    case 'plus':
      return {
        subject: 'Excess product assistance',
        intro: `Someone wants to help you with the extra stock at your ${organisationType}.`,
      };
    default:
      throw new Error(`Unknown type ${type}`);
  }
};

const getWhoFromValue = (value: string): string => {
  switch (value) {
    case 'charityVolunteerGroup':
      return 'I work for a charity or volunteer group';
    case 'parentGuardian':
      return 'I am a parent or guardian';
    case 'public':
      return 'I am a member of the public';
    case 'anotherSchool':
      return 'I work at another school';
    case 'somethingElse':
      return 'Another connection';
    default:
      return '';
  }
};
