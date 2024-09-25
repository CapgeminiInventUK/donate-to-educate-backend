import { generate } from 'randomstring';
import { LocalAuthorityUser } from '../../../appsync';
import { SignUpDataRepository } from '../../repository/signUpDataRepository';
import { checkIfDefinedElseDefault } from '../../shared/check';
import { sendEmail } from '../email';

const signUpDataRepository = SignUpDataRepository.getInstance();

export const handleNewLaUser = async (fullDocument: LocalAuthorityUser) => {
  const domainName = checkIfDefinedElseDefault(process?.env?.DOMAIN_NAME);
  const randomString = generate({ charset: 'alphabetic', length: 100 });
  const { email, firstName, name, nameId } = fullDocument;

  await signUpDataRepository.insert({
    id: randomString,
    email,
    type: 'localAuthority',
    name,
    nameId,
  });

  await sendEmail(email, 'create-account-la', {
    subject: 'Complete your sign up to Donate to Educate',
    name: firstName,
    la: name,
    signUpLink: `https://${domainName}/add-user?id=${randomString}`,
  });
};
