import { CharityProfile } from '../../../appsync';
import { CharityUserRepository } from '../../repository/charityUserRepository';
import {
  deleteUserAfterRemoveProfileCallback,
  notifyLaInstitutionProfileDeleted,
} from './removeInstitutionProfileCallbacks';

const charityUserRepository = CharityUserRepository.getInstance();

export const handleDeleteCharityProfile = async ({
  id,
  name: institutionName,
  localAuthority,
}: CharityProfile) => {
  const charityUsers = await charityUserRepository.getAllById(id);
  charityUsers?.forEach(async ({ name, email }) => {
    await deleteUserAfterRemoveProfileCallback(name, institutionName, email, 'charity');
  });
  await notifyLaInstitutionProfileDeleted(localAuthority, institutionName, 'charity');
};
