import { SchoolUser } from '../../../appsync';
import { sendEmail } from '../email';

export const handleDeleteSchoolUser = async ({
  name,
  schoolName,
  email,
}: SchoolUser): Promise<void> => {
  const [firstName] = name.split(' ');
  await sendEmail(email, 'user-deleted', {
    subject: 'You have been removed as a user of Donate to Educate',
    name: firstName,
    institutionName: schoolName,
  });
};
