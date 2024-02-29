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

export type CharityDetails = {
  __typename?: 'CharityDetails';
  about?: Maybe<Scalars['String']['output']>;
  address: Scalars['String']['output'];
  localAuthority: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type CharityProfile = {
  __typename?: 'CharityProfile';
  donate?: Maybe<ProfileItems>;
  excess?: Maybe<ProfileItems>;
  request?: Maybe<ProfileItems>;
};

export type CharitySignUpDetails = {
  __typename?: 'CharitySignUpDetails';
  charityDetails: CharityDetails;
  charityUser: CharityUser;
};

export type CharityUser = {
  __typename?: 'CharityUser';
  email: Scalars['String']['output'];
  jobTitle: Scalars['String']['output'];
  name: Scalars['String']['output'];
  phone: Scalars['String']['output'];
};

export type JoinRequest = {
  __typename?: 'JoinRequest';
  charitySignUpDetails?: Maybe<CharitySignUpDetails>;
  email: Scalars['String']['output'];
  localAuthority: Scalars['String']['output'];
  name: Scalars['String']['output'];
  requestTime: Scalars['Float']['output'];
  schoolSignUpDetails?: Maybe<SchoolUser>;
  status: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

export type LocalAuthority = {
  __typename?: 'LocalAuthority';
  code: Scalars['String']['output'];
  name: Scalars['String']['output'];
  registered: Scalars['Boolean']['output'];
};

export type LocalAuthorityProfile = {
  __typename?: 'LocalAuthorityProfile';
  localAuthority: LocalAuthority;
  user: LocalAuthorityUser;
};

export type LocalAuthorityUser = {
  __typename?: 'LocalAuthorityUser';
  department: Scalars['String']['output'];
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  jobTitle: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  name: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  phone: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  insertJoinRequest: Scalars['Boolean']['output'];
  insertSignUpData: Scalars['Boolean']['output'];
  registerLocalAuthority: Scalars['Boolean']['output'];
  updateJoinRequest: Scalars['Boolean']['output'];
  updateSchoolProfile: Scalars['Boolean']['output'];
};


export type MutationInsertJoinRequestArgs = {
  aboutCharity?: InputMaybe<Scalars['String']['input']>;
  charityAddress?: InputMaybe<Scalars['String']['input']>;
  charityName?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  jobTitle?: InputMaybe<Scalars['String']['input']>;
  localAuthority: Scalars['String']['input'];
  name: Scalars['String']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
  requestTime: Scalars['Float']['input'];
  school?: InputMaybe<Scalars['String']['input']>;
  status: Scalars['String']['input'];
  type: Scalars['String']['input'];
};


export type MutationInsertSignUpDataArgs = {
  email: Scalars['String']['input'];
  id: Scalars['String']['input'];
  type: Scalars['String']['input'];
};


export type MutationRegisterLocalAuthorityArgs = {
  department: Scalars['String']['input'];
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  jobTitle: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  name: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  phone: Scalars['String']['input'];
};


export type MutationUpdateJoinRequestArgs = {
  localAuthority: Scalars['String']['input'];
  name: Scalars['String']['input'];
  status: Scalars['String']['input'];
};


export type MutationUpdateSchoolProfileArgs = {
  key: Scalars['String']['input'];
  name: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type ProfileItems = {
  __typename?: 'ProfileItems';
  actionText: Scalars['String']['output'];
  banner: Scalars['String']['output'];
  helpBannerBody: Scalars['String']['output'];
  helpBannerTitle: Scalars['String']['output'];
  items: Scalars['String']['output'];
  whatToExpect: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  getJoinRequests: Array<JoinRequest>;
  getLocalAuthorities: Array<LocalAuthority>;
  getLocalAuthorityUser: LocalAuthorityUser;
  getRegisteredSchools: Array<School>;
  getSchoolByName: School;
  getSchoolProfile: SchoolProfile;
  getSchools: Array<School>;
  getSchoolsByLa: Array<School>;
  getSignUpData?: Maybe<SignUpData>;
};


export type QueryGetLocalAuthorityUserArgs = {
  email: Scalars['String']['input'];
};


export type QueryGetSchoolByNameArgs = {
  name: Scalars['String']['input'];
};


export type QueryGetSchoolProfileArgs = {
  name: Scalars['String']['input'];
};


export type QueryGetSchoolsByLaArgs = {
  name: Scalars['String']['input'];
};


export type QueryGetSignUpDataArgs = {
  id: Scalars['String']['input'];
};

export type School = {
  __typename?: 'School';
  isLocalAuthorityRegistered?: Maybe<Scalars['Boolean']['output']>;
  localAuthority: Scalars['String']['output'];
  name: Scalars['String']['output'];
  postcode?: Maybe<Scalars['String']['output']>;
  registered: Scalars['Boolean']['output'];
  urn: Scalars['ID']['output'];
};

export type SchoolProfile = {
  __typename?: 'SchoolProfile';
  donate?: Maybe<ProfileItems>;
  excess?: Maybe<ProfileItems>;
  request?: Maybe<ProfileItems>;
};

export type SchoolUser = {
  __typename?: 'SchoolUser';
  email: Scalars['String']['output'];
  jobTitle: Scalars['String']['output'];
  name: Scalars['String']['output'];
  phone: Scalars['String']['output'];
  school: Scalars['String']['output'];
};

export type SignUpData = {
  __typename?: 'SignUpData';
  email: Scalars['String']['output'];
  id: Scalars['String']['output'];
  type: Scalars['String']['output'];
};
