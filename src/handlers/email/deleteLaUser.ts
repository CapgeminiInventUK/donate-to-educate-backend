import { LocalAuthorityUser } from '../../../appsync';
import { sendEmail } from '../email';

export const handleDeleteLocalAuthorityUser = async ({
  firstName,
  name,
  email,
}: LocalAuthorityUser): Promise<void> => {
  await sendEmail(email, 'user-deleted', {
    subject: 'You have been removed as a user of Donate to Educate',
    name: firstName,
    institutionName: `${name} County Council`,
  });
};
