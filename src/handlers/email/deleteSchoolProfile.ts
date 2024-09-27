import { SchoolProfile } from '../../../appsync';
import { SchoolUserRepository } from '../../repository/schoolUserRepository';
import {
  deleteUserAfterRemoveProfileCallback,
  notifyLaInstitutionProfileDeleted,
} from './removeInstitutionProfileCallbacks';

const schoolUserRepository = SchoolUserRepository.getInstance();

export const handleDeleteSchoolProfile = async ({
  id,
  name: institutionName,
  localAuthority,
}: SchoolProfile) => {
  const schoolUsers = await schoolUserRepository.getAllById(id);
  schoolUsers?.forEach(async ({ name, email }) => {
    await deleteUserAfterRemoveProfileCallback(name, institutionName, email, 'school');
  });
  await notifyLaInstitutionProfileDeleted(localAuthority, institutionName, 'school');
};
