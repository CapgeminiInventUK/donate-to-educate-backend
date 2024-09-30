import { CharityUser } from '../../../appsync';
import { sendEmail } from '../email';

export const handleDeleteCharityUser = async ({
  name,
  charityName,
  email,
}: CharityUser): Promise<void> => {
  const [firstName] = name.split(' ');
  await sendEmail(email, 'user-deleted', {
    subject: 'You have been removed as a user of Donate to Educate',
    name: firstName,
    institutionName: charityName,
  });
};
