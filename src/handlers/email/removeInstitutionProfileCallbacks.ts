import { LocalAuthorityUserRepository } from '../../repository/localAuthorityUserRepository';
import { sendEmail } from '../email';

const localAuthorityUserRepository = LocalAuthorityUserRepository.getInstance();

export const deleteUserAfterRemoveProfileCallback = async (
  name: string,
  institutionName: string,
  email: string,
  type: 'school' | 'charity'
): Promise<void> => {
  await sendEmail(email, 'profile-deleted-notify-users', {
    subject: `We have removed your ${type} from Donate to Educate`,
    name,
    institutionName,
  });
};

export const notifyLaInstitutionProfileDeleted = async (
  localAuthority: string,
  institutionName: string,
  type: 'school' | 'charity'
) => {
  const { email = '' } = (await localAuthorityUserRepository.getByName(localAuthority)) || {};
  await sendEmail(email, 'institution-deleted-notify-la', {
    subject: `We have removed a ${type} from Donate to Educate`,
    institutionName,
  });
};
