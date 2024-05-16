import { JoinRequest, LocalAuthority, School } from '../../appsync';
import { removeFields } from './graphql';

interface infoType {
  selectionSetList: string[];
  selectionSetGraphQL: string;
  parentTypeName: string;
  fieldName: string;
  variables: Record<string, unknown>;
}

const removePostcodeFromSchoolName = (
  schoolName?: string | null,
  postcode?: string | null
): string => {
  return schoolName?.replace(` - ${postcode}`, '') ?? '';
};

export const addSchoolsRequestState = (
  schools: School[],
  localAuthorities: LocalAuthority[],
  schoolJoinRequests: JoinRequest[],
  info: infoType
): School[] => {
  const filteredLas = localAuthorities.map((la) =>
    removeFields<LocalAuthority>(info.selectionSetList, la)
  );
  return schools.map((school) => {
    const { localAuthority, name, postcode } = school;
    const isLocalAuthorityRegistered = filteredLas.find(
      ({ name }) => name === localAuthority
    )?.registered;
    const hasJoinRequest = schoolJoinRequests.some(
      ({ school: schoolName }) => removePostcodeFromSchoolName(schoolName, postcode) === name
    );
    const registrationState = !isLocalAuthorityRegistered
      ? 'laNotRegistered'
      : hasJoinRequest
        ? 'hasJoinRequest'
        : undefined;

    return { ...school, registrationState };
  });
};
