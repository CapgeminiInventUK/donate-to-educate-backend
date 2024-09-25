import { generate } from 'randomstring';
import { v4 as uuidv4 } from 'uuid';
import { JoinRequest } from '../../../appsync';
import { CharityDataRepository } from '../../repository/charityDataRepository';
import { CharityUserRepository } from '../../repository/charityUserRepository';
import { SchoolDataRepository } from '../../repository/schoolDataRepository';
import { SchoolUserRepository } from '../../repository/schoolUserRepository';
import { SignUpDataRepository } from '../../repository/signUpDataRepository';
import { checkIfDefinedElseDefault } from '../../shared/check';
import { splitAtLastHyphen } from '../../shared/global';
import { sendEmail } from '../email';

const charityDataRepository = CharityDataRepository.getInstance();
const charityUserRepository = CharityUserRepository.getInstance();
const schoolDataRepository = SchoolDataRepository.getInstance();
const schoolUserRepository = SchoolUserRepository.getInstance();
const signUpDataRepository = SignUpDataRepository.getInstance();

export const handleJoinRequests = async (
  fullDocument: JoinRequest,
  fullDocumentBeforeChange: JoinRequest
): Promise<void> => {
  const domainName = checkIfDefinedElseDefault(process?.env?.DOMAIN_NAME);
  if (fullDocument) {
    const randomString = generate({ charset: 'alphabetic', length: 100 });
    const {
      email,
      name,
      type,
      school,
      charityName,
      charityAddress,
      aboutCharity,
      localAuthority,
      jobTitle,
      phone,
      urn,
      postcode,
    } = fullDocument as JoinRequest;

    if (type === 'school' && school) {
      const schoolName = splitAtLastHyphen(school);

      await signUpDataRepository.insert({
        id: randomString,
        email,
        type,
        name: schoolName,
        nameId: checkIfDefinedElseDefault(urn),
      });

      await schoolDataRepository.setToRegistered(schoolName, checkIfDefinedElseDefault(urn));

      await schoolUserRepository.insert({
        name,
        phone: phone ?? '',
        jobTitle: jobTitle ?? '',
        email,
        schoolId: urn ?? '',
        schoolName: school ?? '',
      });
    } else if (type === 'charity') {
      const charityId = uuidv4();
      await signUpDataRepository.insert({
        id: randomString,
        email,
        type,
        name: checkIfDefinedElseDefault(charityName),
        nameId: charityId,
      });

      await charityDataRepository.insert({
        id: charityId,
        name: checkIfDefinedElseDefault(charityName),
        address: checkIfDefinedElseDefault(charityAddress),
        about: checkIfDefinedElseDefault(aboutCharity),
        localAuthority,
        postcode,
      });

      await charityUserRepository.insert({
        email,
        phone: phone ?? '',
        jobTitle: jobTitle ?? '',
        charityName: charityName ?? '',
        charityId,
        name,
      });
    } else {
      throw new Error(`Invalid type ${type}`);
    }

    await sendEmail(email, 'join-request-approved', {
      subject: 'Your Donate to Educate application results',
      name,
      signUpLink: `https://${domainName}/add-user?id=${randomString}`,
    });

    // TODO do something with la email sending
    // const la = await localAuthorityUserRepository.getByName(localAuthority);

    // await sendEmail(checkIfDefinedElseDefault(la?.email), 'reviewed-requests-to-join', {
    //   subject: "We've reviewed your requests to join",
    //   reviewLink: `https://${domainName}/login`,
    // });
  } else {
    const { email, name } = fullDocumentBeforeChange;

    await sendEmail(email, 'join-request-declined', {
      subject: 'Your Donate to Educate application results',
      name,
    });

    // TODO do something with la email sending
    // const la = await localAuthorityUserRepository.getByName(localAuthority);

    // await sendEmail(checkIfDefinedElseDefault(la?.email), 'reviewed-requests-to-join', {
    //   subject: "We've reviewed your requests to join",
    //   reviewLink: `https://${domainName}/login`,
    // });
  }
};
