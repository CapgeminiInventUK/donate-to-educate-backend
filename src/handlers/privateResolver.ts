import { AppSyncResolverHandler } from 'aws-lambda';
import {
  MutationRegisterLocalAuthorityArgs,
  MutationUpdateSchoolProfileArgs,
  MutationUpdateJoinRequestArgs,
  MutationInsertSignUpDataArgs,
} from '../../appsync';
import { logger } from '../shared/logger';
import { LocalAuthorityDataRepository } from '../repository/localAuthorityDataRepository';
import { LocalAuthorityUserRepository } from '../repository/localAuthorityUserRepository';
import { JoinRequestsRepository } from '../repository/joinRequestsRepository';
import { SchoolProfileRepository } from '../repository/schoolProfileRepository';
import { SignUpDataRepository } from '../repository/signUpDataRepository';

const localAuthorityDataRepository = LocalAuthorityDataRepository.getInstance();
const localAuthorityUserRepository = LocalAuthorityUserRepository.getInstance();
const joinRequestsRepository = JoinRequestsRepository.getInstance();
const schoolProfileRepository = SchoolProfileRepository.getInstance();
const signUpDataRepository = SignUpDataRepository.getInstance();

export const handler: AppSyncResolverHandler<
  | MutationRegisterLocalAuthorityArgs
  | MutationInsertSignUpDataArgs
  | MutationUpdateSchoolProfileArgs
  | MutationUpdateJoinRequestArgs,
  boolean
> = async (event, context, callback) => {
  logger.info(`Running function with ${JSON.stringify(event)}`);
  context.callbackWaitsForEmptyEventLoop = false;

  const { arguments: params, info } = event;
  logger.info(`${JSON.stringify(params)}`);

  switch (info.fieldName) {
    case 'registerLocalAuthority': {
      const { name, firstName, lastName, email, phone, department, jobTitle, notes } =
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
      });
      callback(null, register && insert);
      break;
    }
    case 'updateJoinRequest': {
      const { localAuthority, name, status } = params as MutationUpdateJoinRequestArgs;
      const res = await joinRequestsRepository.updateStatus(localAuthority, name, status);
      callback(null, res);
      break;
    }
    case 'updateSchoolProfile': {
      const { name, key, value } = params as MutationUpdateSchoolProfileArgs;
      const res = await schoolProfileRepository.updateKey(name, key, value);
      callback(null, res);
      break;
    }
    case 'insertSignUpData': {
      const { id, email, type } = params as MutationInsertSignUpDataArgs;
      const res = await signUpDataRepository.insert({ id, email, type });
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
