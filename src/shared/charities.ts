import { Charity } from '../../appsync';
import { CharityProfileRepository } from '../repository/charityProfileRepository';

const charityProfileRepository = CharityProfileRepository.getInstance();

export const addProductListsToCharities = async (
  charities: Charity[],
  localAuthority: string
): Promise<Charity[]> => {
  const charityProfiles = await charityProfileRepository.getByLa(localAuthority);
  return charities.map((charity) => {
    const { request, donate, excess } =
      charityProfiles.find(({ name }) => charity.name === name) ?? {};
    return { request, donate, excess, ...charity };
  });
};
