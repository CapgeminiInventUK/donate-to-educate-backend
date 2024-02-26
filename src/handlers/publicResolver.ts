import { AppSyncResolverHandler } from 'aws-lambda';
import { School, QueryGetSchoolByNameArgs } from '../../appsync';
import { logger } from '../shared/logger';
import { SchoolDataRepository } from '../repository/schoolDataRepository';

const schoolDataRepository = SchoolDataRepository.getInstance();

export const handler: AppSyncResolverHandler<QueryGetSchoolByNameArgs, School> = async (
  event,
  context,
  callback
) => {
  logger.info(`Running function with ${JSON.stringify(event)}`);
  context.callbackWaitsForEmptyEventLoop = false;

  const { arguments: params, info } = event;
  logger.info(`${JSON.stringify(params)}`);

  switch (info.fieldName) {
    case 'getSchoolByNamePublic': {
      const { name } = params;
      const school = await schoolDataRepository.getByName(name);
      if (!school) {
        callback(null);
        break;
      }
      callback(null, removeFields<School>(info.selectionSetList, school));
      break;
    }
    default: {
      callback(`Unexpected type ${info.fieldName}`);
      throw new Error(`Unexpected type ${info.fieldName}`);
    }
  }

  throw new Error('An unknown error occurred');
};

const removeFields = <T extends object>(selectionSetList: string[], obj: T): T => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (selectionSetList.includes(key)) {
      acc = { ...acc, [key]: value as string };
    }
    return acc;
  }, {} as T);
};
