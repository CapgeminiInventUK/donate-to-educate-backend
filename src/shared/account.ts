import { UserType } from '../handlers/zodSchemas';
import { CharityUserRepository } from '../repository/charityUserRepository';
import { LocalAuthorityUserRepository } from '../repository/localAuthorityUserRepository';
import { SchoolUserRepository } from '../repository/schoolUserRepository';

const localAuthorityUserRepository = LocalAuthorityUserRepository.getInstance();
const schoolUserRepository = SchoolUserRepository.getInstance();
const charityUserRepository = CharityUserRepository.getInstance();

export const getExistingUsers = async (type: UserType, id: string): Promise<number> => {
  const repository =
    type === UserType.Charity
      ? charityUserRepository
      : type === UserType.School
        ? schoolUserRepository
        : localAuthorityUserRepository;
  const users = await repository.getAllById(id);
  return users?.length ?? 0;
};
