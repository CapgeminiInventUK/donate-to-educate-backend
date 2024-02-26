import { AppSyncResolverHandler } from 'aws-lambda';
import { MutationInsertSignUpDataArgs } from '../../appsync';
import { logger } from '../shared/logger';
import { SignUpDataRepository } from '../repository/signUpDataRepository';

const signUpDataRepository = SignUpDataRepository.getInstance();

export const handler: AppSyncResolverHandler<MutationInsertSignUpDataArgs, boolean> = async (
  event,
  context,
  callback
) => {
  logger.info(`Running function with ${JSON.stringify(event)}`);
  context.callbackWaitsForEmptyEventLoop = false;

  const { arguments: params, info } = event;
  logger.info(`${JSON.stringify(params)}`);

  switch (info.fieldName) {
    case 'insertSignUpDataPrivate': {
      const { id, email, type } = params;
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
