import { LocalAuthorityRegisterRequest } from '../../../appsync';
import { fullLogo, shortLogo } from '../../shared/image';
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
    shortLogo,
    fullLogo,
    email,
    name,
    localAuthority,
    message,
  });
};
