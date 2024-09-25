import { LocalAuthorityRegisterRequest } from '../../../appsync';
import { sendEmail } from '../email';

const fromEmailAddress = 'team@donatetoeducate.org.uk';

export const handleLocalAuthorityRegisterRequests = async ({
  name,
  email,
  localAuthority,
  message,
  type,
}: LocalAuthorityRegisterRequest) => {
  await sendEmail(fromEmailAddress, 'la-not-joined', {
    type,
    subject: 'Local authority has not joined',
    email,
    name,
    localAuthority,
    message,
  });
};
