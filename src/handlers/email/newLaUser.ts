import { generate } from 'randomstring';
import { LocalAuthorityUser } from '../../../appsync';
import { LocalAuthorityUserRepository } from '../../repository/localAuthorityUserRepository';
import { SignUpDataRepository } from '../../repository/signUpDataRepository';
import { checkIfDefinedElseDefault } from '../../shared/check';
import { sendEmail } from '../email';

const signUpDataRepository = SignUpDataRepository.getInstance();
const localAuthorityUserRepository = LocalAuthorityUserRepository.getInstance();

export const handleNewLaUser = async (fullDocument: LocalAuthorityUser) => {
  const { email, firstName, name, nameId } = fullDocument;

  const laUsers = await localAuthorityUserRepository.getAllById(nameId);

  if (laUsers && laUsers?.length > 0) {
    return;
  }

  const domainName = checkIfDefinedElseDefault(process?.env?.DOMAIN_NAME);
  const randomString = generate({ charset: 'alphabetic', length: 100 });

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
