import { handler } from '../privateResolver';

const mockContext = {
  callbackWaitsForEmptyEventLoop: false,
  functionName: '',
  functionVersion: '',
  invokedFunctionArn: '',
  memoryLimitInMB: '',
  awsRequestId: '',
  logGroupName: '',
  logStreamName: '',
  getRemainingTimeInMillis: (): number => 0,
  done: (): void => undefined,
  fail: (): void => undefined,
  succeed: (): void => undefined,
};

const mockCallback = jest.fn();

describe('privateResolver lambda function tests', () => {
  beforeEach(() => {});
  test('Should validate payload and write to db when payload is formatted correctly', async () => {
    // const payload = {
    //   name: 'Testy Mctest',
    //   firstName: 'Testy',
    //   lastName: 'McTest',
    //   email: 'testschool123@test.com',
    //   phone: '07123456789',
    //   department: 'Administration',
    //   jobTitle: 'Teacher',
    //   notes: undefined,
    //   nameId: '123FAKEID',
    // };

    const mockEvent = {
      info: {
        selectionSetList: ['name'],
        selectionSetGraphQL: 'test',
        parentTypeName: 'test',
        fieldName: 'registerLocalAuthority',
        variables: {
          test: 'test',
        },
      },
      arguments: {
        name: 'Testy Mctest',
        firstName: 'Testy',
        lastName: 'McTest',
        email: 'testschool123@test.com',
        phone: '07123456789',
        department: 'Administration',
        jobTitle: 'Teacher',
        notes: undefined,
        nameId: '123FAKEID',
      },
      source: null,
      request: {
        headers: {
          test: undefined,
        },
        domainName: null,
      },
      prev: null,
      stash: {},
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const result = await handler(mockEvent, mockContext, mockCallback);
  });
});

// selectionSetList: string[];
//         selectionSetGraphQL: string;
//         parentTypeName: string;
//         fieldName: string;
//         variables: { [key: string]: any };

// department: Scalars['String']['input'];
//   email: Scalars['String']['input'];
//   firstName: Scalars['String']['input'];
//   jobTitle: Scalars['String']['input'];
//   lastName: Scalars['String']['input'];
//   name: Scalars['String']['input'];
//   nameId: Scalars['String']['input'];
//   notes?: InputMaybe<Scalars['String']['input']>;
//   phone: Scalars['String']['input'];
