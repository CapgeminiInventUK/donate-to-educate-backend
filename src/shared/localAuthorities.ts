import { Charity, LocalAuthority, School } from '../../appsync';
import { removeFields } from './graphql';
import { infoType } from './schools';

export const addSchoolsAndCharitiesToLa = (
  las: LocalAuthority[],
  schools: School[],
  charities: Charity[],
  info: infoType
) => {
  return las.map((la) => {
    const registeredSchools =
      schools.filter((school) => school.localAuthority === la.name && school.registered)?.length ??
      0;
    const registeredCharities =
      charities.filter((charity) => charity.localAuthority === la.name)?.length ?? 0;
    return removeFields<LocalAuthority>(info.selectionSetList, {
      ...la,
      registeredSchools,
      registeredCharities,
    });
  });
};
