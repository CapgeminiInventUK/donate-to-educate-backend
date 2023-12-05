export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type JoinRequest = {
  __typename?: 'JoinRequest';
  localAuthority: Scalars['String']['output'];
  name: Scalars['String']['output'];
  requestTime: Scalars['Int']['output'];
  type: Scalars['String']['output'];
};

export type La = {
  __typename?: 'LA';
  department: Scalars['String']['output'];
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  jobTitle: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  phone: Scalars['String']['output'];
};

export type LocalAuthority = {
  __typename?: 'LocalAuthority';
  code: Scalars['String']['output'];
  name: Scalars['String']['output'];
  registered: Scalars['Boolean']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  registerLocalAuthority: Scalars['Boolean']['output'];
};


export type MutationRegisterLocalAuthorityArgs = {
  la: La;
  name: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  getJoinRequests: Array<JoinRequest>;
  getLocalAuthorities: Array<LocalAuthority>;
  getSchoolByName: School;
  getSchools: Array<School>;
  getSchoolsByLa: Array<School>;
};


export type QueryGetSchoolByNameArgs = {
  name: Scalars['String']['input'];
};


export type QueryGetSchoolsByLaArgs = {
  name: Scalars['String']['input'];
};

export type School = {
  __typename?: 'School';
  localAuthority: Scalars['String']['output'];
  name: Scalars['String']['output'];
  postcode?: Maybe<Scalars['String']['output']>;
  registered: Scalars['Boolean']['output'];
  urn: Scalars['ID']['output'];
};
