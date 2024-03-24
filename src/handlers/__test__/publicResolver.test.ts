import { handler } from '../publicResolver';

const event = {
  source: {},
  request: {
    headers: {},
    domainName: '',
  },
  info: {
    selectionSetList: [],
    selectionSetGraphQL: '',
    parentTypeName: '',
    fieldName: 'missingFieldName',
    variables: {},
  },
  arguments: {
    name: '123',
  },
  prev: { result: {} },
  stash: {},
};

const context = {
  callbackWaitsForEmptyEventLoop: false,
  functionName: '',
  functionVersion: '',
  invokedFunctionArn: '',
  memoryLimitInMB: '',
  awsRequestId: '',
  logGroupName: '',
  logStreamName: '',
  identity: {
    cognitoIdentityId: '',
    cognitoIdentityPoolId: '',
  },
  clientContext: {
    client: {
      installationId: '',
      appTitle: '',
      appVersionName: '',
      appVersionCode: '',
      appPackageName: '',
    },
    Custom: '',
    env: { platformVersion: '', platform: '', make: '', model: '', locale: '' },
  },
  getRemainingTimeInMillis: (): number => 0,
  done: (): void => undefined,
  fail: (): void => undefined,
  succeed: (): void => undefined,
};

const callback = jest.fn();

describe('Public Resolver', () => {
  it('Throws error if field name does not match', async () => {
    await expect(async () => {
      await handler(event, context, callback);
    }).rejects.toThrow('Unexpected type missingFieldName');
  });
});
