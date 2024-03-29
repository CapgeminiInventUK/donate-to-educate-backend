import { AppSyncResolverHandler } from 'aws-lambda';
import {
  MutationRegisterLocalAuthorityArgs,
  MutationUpdateSchoolProfileArgs,
  MutationUpdateJoinRequestArgs,
  MutationInsertSignUpDataArgs,
  MutationInsertJoinRequestArgs,
  MutationInsertItemQueryArgs,
  MutationInsertLocalAuthorityRegisterRequestArgs,
  MutationDeleteDeniedJoinRequestArgs,
  MutationUpdateCharityProfileArgs,
  MutationDeleteSchoolProfileArgs,
  MutationAcceptPrivacyPolicyArgs,
  MutationDeleteCharityProfileArgs,
} from '../../appsync';
import { logger } from '../shared/logger';
import { v4 as uuidv4 } from 'uuid';
import { LocalAuthorityDataRepository } from '../repository/localAuthorityDataRepository';
import { LocalAuthorityUserRepository } from '../repository/localAuthorityUserRepository';
import { JoinRequestsRepository } from '../repository/joinRequestsRepository';
import { SchoolProfileRepository } from '../repository/schoolProfileRepository';
import { SignUpDataRepository } from '../repository/signUpDataRepository';
import { ItemQueriesRepository } from '../repository/itemQueriesRepository';
import { LocalAuthorityRegisterRequestsRepository } from '../repository/localAuthorityRegisterRequestsRepository';
import { SchoolDataRepository } from '../repository/schoolDataRepository';
import { CharityProfileRepository } from '../repository/charityProfileRepository';
import { CharityDataRepository } from '../repository/charityDataRepository';

const localAuthorityDataRepository = LocalAuthorityDataRepository.getInstance();
const localAuthorityUserRepository = LocalAuthorityUserRepository.getInstance();
const joinRequestsRepository = JoinRequestsRepository.getInstance();
const schoolProfileRepository = SchoolProfileRepository.getInstance();
const charityProfileRepository = CharityProfileRepository.getInstance();
const signUpDataRepository = SignUpDataRepository.getInstance();
const itemQueriesRepository = ItemQueriesRepository.getInstance();
const localAuthorityRegisterRequestsRepository =
  LocalAuthorityRegisterRequestsRepository.getInstance();
const schoolDataRepository = SchoolDataRepository.getInstance();
const charityDataRepository = CharityDataRepository.getInstance();

export const handler: AppSyncResolverHandler<
  | MutationRegisterLocalAuthorityArgs
  | MutationInsertSignUpDataArgs
  | MutationUpdateSchoolProfileArgs
  | MutationUpdateCharityProfileArgs
  | MutationUpdateJoinRequestArgs
  | MutationInsertItemQueryArgs
  | MutationInsertJoinRequestArgs
  | MutationDeleteDeniedJoinRequestArgs
  | MutationDeleteSchoolProfileArgs
  | MutationAcceptPrivacyPolicyArgs
  | MutationInsertLocalAuthorityRegisterRequestArgs,
  boolean
> = async (event, context, callback) => {
  logger.info(`Running function with ${JSON.stringify(event)}`);
  context.callbackWaitsForEmptyEventLoop = false;

  const { arguments: params, info } = event;
  logger.info(`${JSON.stringify(params)}`);

  switch (info.fieldName) {
    case 'registerLocalAuthority': {
      const { name, firstName, lastName, email, phone, department, jobTitle, notes, nameId } =
        params as MutationRegisterLocalAuthorityArgs;
      const register = await localAuthorityDataRepository.setToRegistered(name);
      const insert = await localAuthorityUserRepository.insert({
        name,
        firstName,
        lastName,
        email,
        phone,
        department,
        jobTitle,
        notes,
        nameId,
      });
      callback(null, register && insert);
      break;
    }
    case 'updateJoinRequest': {
      const { localAuthority, name, status, id } = params as MutationUpdateJoinRequestArgs;
      const res = await joinRequestsRepository.updateStatus(id, localAuthority, name, status);

      callback(null, res);
      break;
    }
    case 'updateSchoolProfile': {
      const { key, value } = params as MutationUpdateSchoolProfileArgs;
      const { institution, institutionId } = info.variables as {
        institution: string;
        institutionId: string;
      };
      const { localAuthority = '', postcode = '' } =
        (await schoolDataRepository.getByName(institution)) ?? {};
      const res = await schoolProfileRepository.updateKey(
        institutionId,
        institution,
        key,
        value,
        localAuthority,
        postcode
      );
      callback(null, res);
      break;
    }
    case 'updateCharityProfile': {
      const { key, value } = params as MutationUpdateSchoolProfileArgs;
      const { institution, institutionId } = info.variables as {
        institution: string;
        institutionId: string;
      };

      const { localAuthority = '' } = (await charityDataRepository.getById(institutionId)) ?? {};
      const res = await charityProfileRepository.updateKey(
        institutionId,
        institution,
        key,
        value,
        localAuthority
      );

      if (key === 'postcode') {
        await charityDataRepository.updatePostcode(
          institutionId,
          institution,
          localAuthority,
          value
        );
      }
      callback(null, res);
      break;
    }
    case 'insertSignUpData': {
      const { id, email, type, name, nameId } = params as MutationInsertSignUpDataArgs;
      const res = await signUpDataRepository.insert({ id, email, type, name, nameId });
      callback(null, res);
      break;
    }
    case 'insertJoinRequest': {
      const status = 'NEW';
      const id = uuidv4();
      const requestTime = Number(new Date());
      const res = await joinRequestsRepository.insert({
        ...(params as MutationInsertJoinRequestArgs),
        status,
        requestTime,
        id,
      });
      callback(null, res);
      break;
    }
    case 'insertItemQuery': {
      const { name, email, type, message, who, phone, connection, organisationType } =
        params as MutationInsertItemQueryArgs;
      const res = await itemQueriesRepository.insert({
        name,
        email,
        type,
        message,
        who,
        phone,
        organisationType,
        ...(connection && { connection }),
      });
      callback(null, res);
      break;
    }
    case 'insertLocalAuthorityRegisterRequest': {
      const { name, localAuthority, email, message, type } =
        params as MutationInsertLocalAuthorityRegisterRequestArgs;
      const res = await localAuthorityRegisterRequestsRepository.insert({
        name,
        localAuthority,
        email,
        message,
        type,
      });
      callback(null, res);
      break;
    }
    case 'deleteDeniedJoinRequest': {
      const { id } = params as MutationDeleteDeniedJoinRequestArgs;
      const res = await joinRequestsRepository.deleteDenied(id);
      callback(null, res);
      break;
    }
    case 'deleteSchoolProfile': {
      const { name, id } = params as MutationDeleteSchoolProfileArgs;
      const res = await schoolProfileRepository.deleteSchoolProfile(name, id);
      await schoolDataRepository.unregister(name, id);
      callback(null, res);
      break;
    }
    case 'acceptPrivacyPolicy': {
      const { name, nameId, email } = params as MutationAcceptPrivacyPolicyArgs;
      const res = await localAuthorityUserRepository.setPrivacyPolicyAccepted(name, nameId, email);
      callback(null, res);
      break;
    }
    case 'deleteCharityProfile': {
      const { name, id } = params as MutationDeleteCharityProfileArgs;
      const res = await charityProfileRepository.deleteCharityProfile(name, id);
      await charityDataRepository.deleteCharity(name, id);
      callback(null, res);
      break;
    }

    default: {
      callback(`Unexpected type ${info.fieldName}`);
      throw new Error(`Unexpected type ${info.fieldName}`);
    }
  }

  throw new Error('An unknown error occurred');
};
