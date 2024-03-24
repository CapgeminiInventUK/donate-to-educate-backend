import { AppSyncResolverEvent, Context } from 'aws-lambda';
import { MongoClient, OptionalUnlessRequiredId, Document } from 'mongodb';

export const generateEvent = <T>(
  fieldName: string,
  fields: string[] = [],
  params?: T
): AppSyncResolverEvent<T> => ({
  source: {},
  request: {
    headers: {},
    domainName: '',
  },
  info: {
    selectionSetList: fields,
    selectionSetGraphQL: '',
    parentTypeName: '',
    fieldName,
    variables: {},
  },
  arguments: params ?? ({} as T),
  prev: { result: {} },
  stash: {},
});

export const generateContext = (): Context => ({
  callbackWaitsForEmptyEventLoop: false,
  functionName: 'Mock',
  functionVersion: '1.0.0',
  invokedFunctionArn: 'arn',
  memoryLimitInMB: '1024',
  awsRequestId: '',
  logGroupName: 'logGroup',
  logStreamName: 'logStream',
  identity: {
    cognitoIdentityId: '',
    cognitoIdentityPoolId: '',
  },
  clientContext: {
    client: {
      installationId: '',
      appTitle: 'D2E',
      appVersionName: '1.0.0',
      appVersionCode: '1.0.0',
      appPackageName: 'D2E',
    },
    Custom: '',
    env: { platformVersion: '', platform: '', make: '', model: '', locale: '' },
  },
  getRemainingTimeInMillis: (): number => 0,
  done: (): void => undefined,
  fail: (): void => undefined,
  succeed: (): void => undefined,
});

export const insertData = async <T extends Document>(
  collectionName: string,
  documents: OptionalUnlessRequiredId<T>[]
): Promise<void> => {
  const client = new MongoClient(process.env.MONGO_URL ?? '');
  const collection = client.db('D2E').collection<T>(collectionName);
  await collection.insertMany(documents);
  await client.close();
};

export const dropDatabase = async (): Promise<void> => {
  const client = new MongoClient(process.env.MONGO_URL ?? '');
  await client.db('D2E').dropDatabase();
  await client.close();
};

export const dropCollection = async (collectionName: string): Promise<void> => {
  const client = new MongoClient(process.env.MONGO_URL ?? '');
  await client.db('D2E').dropCollection(collectionName);
  await client.close();
};

export const createIndex = async (collectionName: string): Promise<void> => {
  const client = new MongoClient(process.env.MONGO_URL ?? '');
  const collection = client.db('D2E').collection(collectionName);
  await collection.createIndex({ location: '2dsphere' });
  await client.close();
};
