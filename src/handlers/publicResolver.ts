import { AppSyncResolverHandler } from 'aws-lambda';
import { MutationInsertSignUpDataArgs, SignUpData } from '../../appsync';
import { logger } from '../shared/logger';
import { MongoClient } from 'mongodb';

const client = new MongoClient(
  process?.env?.MONGODB_CONNECTION_STRING ?? 'mongodb://localhost:27017/'
);

const db = client.db('D2E');
const collection = db.collection<SignUpData>('SignUps');
export const handler: AppSyncResolverHandler<
  MutationInsertSignUpDataArgs,
  SignUpData[] | boolean
> = async (event, context, callback) => {
  logger.info(`Running function with ${JSON.stringify(event)}`);
  context.callbackWaitsForEmptyEventLoop = false;

  const { arguments: params, info } = event;
  logger.info(`${JSON.stringify(params)}`);

  switch (info.fieldName) {
    case 'testPublic': {
      const res = await collection.find({}).toArray();
      callback(null, res);
      break;
    }
    case 'testPrivate': {
      const { id, email, type } = params;
      const res = (await collection.insertOne({ id, email, type })).acknowledged;
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
