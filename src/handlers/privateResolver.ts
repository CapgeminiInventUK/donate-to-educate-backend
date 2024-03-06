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
} from '../../appsync';
import { logger } from '../shared/logger';
import { LocalAuthorityDataRepository } from '../repository/localAuthorityDataRepository';
import { LocalAuthorityUserRepository } from '../repository/localAuthorityUserRepository';
import { JoinRequestsRepository } from '../repository/joinRequestsRepository';
import { SchoolProfileRepository } from '../repository/schoolProfileRepository';
import { SignUpDataRepository } from '../repository/signUpDataRepository';
import { ItemQueriesRepository } from '../repository/itemQueriesRepository';
import { LocalAuthorityRegisterRequestsRepository } from '../repository/localAuthorityRegisterRequestsRepository';

const localAuthorityDataRepository = LocalAuthorityDataRepository.getInstance();
const localAuthorityUserRepository = LocalAuthorityUserRepository.getInstance();
const joinRequestsRepository = JoinRequestsRepository.getInstance();
const schoolProfileRepository = SchoolProfileRepository.getInstance();
const signUpDataRepository = SignUpDataRepository.getInstance();
const itemQueriesRepository = ItemQueriesRepository.getInstance();
const localAuthorityRegisterRequestsRepository =
  LocalAuthorityRegisterRequestsRepository.getInstance();

export const handler: AppSyncResolverHandler<
  | MutationRegisterLocalAuthorityArgs
  | MutationInsertSignUpDataArgs
  | MutationUpdateSchoolProfileArgs
  | MutationUpdateJoinRequestArgs
  | MutationInsertItemQueryArgs
  | MutationInsertJoinRequestArgs
  | MutationDeleteDeniedJoinRequestArgs
  | MutationInsertLocalAuthorityRegisterRequestArgs,
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
      const { id, email, type, name } = params as MutationInsertSignUpDataArgs;
      const res = await signUpDataRepository.insert({ id, email, type, name });
      callback(null, res);
      break;
    }
    case 'insertJoinRequest': {
      const status = 'NEW';
      const requestTime = Number(new Date());
      const res = await joinRequestsRepository.insert({
        ...(params as MutationInsertJoinRequestArgs),
        status,
        requestTime,
      });
      callback(null, res);
      break;
    }
    case 'insertItemQuery': {
      const { name, email, type, message, who, phone, connection } =
        params as MutationInsertItemQueryArgs;
      const res = await itemQueriesRepository.insert({
        name,
        email,
        type,
        message,
        who,
        phone,
        ...(connection && { connection }),
      });
      callback(null, res);
      break;
    }
    case 'insertLocalAuthorityRegisterRequest': {
      const { name, email, message } = params as MutationInsertLocalAuthorityRegisterRequestArgs;
      const res = await localAuthorityRegisterRequestsRepository.insert({ name, email, message });
      callback(null, res);
      break;
    }
    case 'deleteDeniedJoinRequest': {
      const { name } = params as MutationDeleteDeniedJoinRequestArgs;
      const res = await joinRequestsRepository.deleteDenied(name);
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
