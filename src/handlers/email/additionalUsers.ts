import { generate } from 'randomstring';
import { AdditionalUser } from '../../../appsync';
import { CharityUserRepository } from '../../repository/charityUserRepository';
import { LocalAuthorityUserRepository } from '../../repository/localAuthorityUserRepository';
import { SchoolDataRepository } from '../../repository/schoolDataRepository';
import { SchoolUserRepository } from '../../repository/schoolUserRepository';
import { SignUpDataRepository } from '../../repository/signUpDataRepository';
import { checkIfDefinedElseDefault } from '../../shared/check';
import { sendEmail } from '../email';

const signUpDataRepository = SignUpDataRepository.getInstance();
const schoolDataRepository = SchoolDataRepository.getInstance();
const charityUserRepository = CharityUserRepository.getInstance();
const schoolUserRepository = SchoolUserRepository.getInstance();
const localAuthorityUserRepository = LocalAuthorityUserRepository.getInstance();

export const handleAdditionalUsers = async (fullDocument: AdditionalUser) => {
  const domainName = checkIfDefinedElseDefault(process?.env?.DOMAIN_NAME);
  const randomString = generate({ charset: 'alphabetic', length: 100 });
  const {
    type,
    id,
    name,
    email,
    localAuthority,
    jobTitle,
    school,
    phone,
    charityName,
    urn,
    department,
    addedBy,
  } = fullDocument;

  const [firstName, lastName] = name.split(' ');

  if (type === 'localAuthority') {
    await signUpDataRepository.insert({
      id: randomString,
      email,
      type,
      name: localAuthority,
      nameId: id,
    });

    await localAuthorityUserRepository.insert({
      department: String(department),
      email,
      firstName,
      lastName,
      jobTitle,
      name: localAuthority,
      nameId: id,
      phone: String(phone),
    });
  }

  if (type === 'school' && school) {
    await signUpDataRepository.insert({
      id: randomString,
      email,
      type,
      name: school,
      nameId: checkIfDefinedElseDefault(urn),
    });

    await schoolDataRepository.setToRegistered(school, checkIfDefinedElseDefault(urn));

    await schoolUserRepository.insert({
      name,
      phone: phone ?? '',
      jobTitle: jobTitle ?? '',
      email,
      schoolId: urn ?? '',
      schoolName: school ?? '',
    });
  } else if (type === 'charity') {
    await signUpDataRepository.insert({
      id: randomString,
      email,
      type,
      name: checkIfDefinedElseDefault(charityName),
      nameId: id,
    });

    await charityUserRepository.insert({
      email,
      phone: phone ?? '',
      jobTitle: jobTitle ?? '',
      charityName: charityName ?? '',
      charityId: id,
      name,
    });
  }

  await sendEmail(email, 'additional-user', {
    subject: 'Confirm your email for Donate to Educate',
    name: firstName,
    institutionName: school ?? charityName ?? localAuthority,
    signUpLink: `https://${domainName}/add-user?id=${randomString}`,
  }).then(async () => {
    if (addedBy === 'admin') {
      const { email: laEmail = '' } =
        (await localAuthorityUserRepository.getByName(localAuthority)) || {};
      await sendEmail(laEmail, 'additional-user-notify-institution', {
        subject: 'We have added a user of Donate to Educate',
        institutionName: school ?? charityName ?? localAuthority,
      });
    }
  });
};
