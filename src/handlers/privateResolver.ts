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
// import { validatePayload } from '../utils/validatePayload';
import { CharityProfileRepository } from '../repository/charityProfileRepository';
import { CharityDataRepository } from '../repository/charityDataRepository';
// import { generateSchema } from '../utils/generateSchema';
import {
  deleteDeniedJoinRequestSchema,
  insertItemQuerySchema,
  insertJoinRequestSchema,
  insertLocalAuthorityRegisterRequestSchema,
  insertSignUpDataSchema,
  registerLocalAuthoritySchema,
  updateCharityProfileSchema,
  updateJoinRequestSchema,
  updateSchoolProfileSchema,
} from './zodSchemas';

const localAuthorityDataRepository = LocalAuthorityDataRepository.getInstance(
  process.env.MONGO_URL,
  true
);
const localAuthorityUserRepository = LocalAuthorityUserRepository.getInstance(
  process.env.MONGO_URL,
  true
);
const joinRequestsRepository = JoinRequestsRepository.getInstance(process.env.MONGO_URL, true);
const schoolProfileRepository = SchoolProfileRepository.getInstance(process.env.MONGO_URL, true);
const charityProfileRepository = CharityProfileRepository.getInstance(process.env.MONGO_URL, true);
const signUpDataRepository = SignUpDataRepository.getInstance(process.env.MONGO_URL, true);
const itemQueriesRepository = ItemQueriesRepository.getInstance(process.env.MONGO_URL, true);
const localAuthorityRegisterRequestsRepository =
  LocalAuthorityRegisterRequestsRepository.getInstance(process.env.MONGO_URL, true);
const schoolDataRepository = SchoolDataRepository.getInstance(process.env.MONGO_URL, true);
const charityDataRepository = CharityDataRepository.getInstance(process.env.MONGO_URL, true);

export const handler: AppSyncResolverHandler<
  | MutationRegisterLocalAuthorityArgs
  | MutationInsertSignUpDataArgs
  | MutationUpdateSchoolProfileArgs
  | MutationUpdateCharityProfileArgs
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
      registerLocalAuthoritySchema.parse(params);

      const { name, firstName, lastName, email, phone, department, jobTitle, notes, nameId } =
        params as MutationRegisterLocalAuthorityArgs;

      // TODOs
      // generate schema based off MutationRegisterLocalAuthorityArgs
      // validate payload/params off that schema
      // throw error if payload doesn't match schema

      // validatePayload<MutationRegisterLocalAuthorityArgs>;

      // console.log(params);
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
      updateJoinRequestSchema.parse(params);

      const { localAuthority, name, status, id } = params as MutationUpdateJoinRequestArgs;
      const res = await joinRequestsRepository.updateStatus(id, localAuthority, name, status);

      callback(null, res);
      break;
    }
    case 'updateSchoolProfile': {
      updateSchoolProfileSchema.parse(params);

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
      updateCharityProfileSchema.parse(params);

      const { key, value } = params as MutationUpdateCharityProfileArgs;
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
      insertSignUpDataSchema.parse(params);

      const { id, email, type, name, nameId } = params as MutationInsertSignUpDataArgs;
      const res = await signUpDataRepository.insert({ id, email, type, name, nameId });
      callback(null, res);
      break;
    }
    case 'insertJoinRequest': {
      insertJoinRequestSchema.parse(params);

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
      insertItemQuerySchema.parse(params);

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
      insertLocalAuthorityRegisterRequestSchema.parse(params);

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
      deleteDeniedJoinRequestSchema.parse(params);

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
