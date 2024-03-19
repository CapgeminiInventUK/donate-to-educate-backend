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
  about?: Maybe<Scalars['String']['output']>;
  donate?: Maybe<ProfileItems>;
  excess?: Maybe<ProfileItems>;
  header?: Maybe<CharityProfileHeader>;
  id: Scalars['String']['output'];
  localAuthority: Scalars['String']['output'];
  name: Scalars['String']['output'];
  postcode: Scalars['String']['output'];
  request?: Maybe<ProfileItems>;
};

export type CharityProfileHeader = {
  __typename?: 'CharityProfileHeader';
  address?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  website?: Maybe<Scalars['String']['output']>;
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

export type ItemQuery = {
  __typename?: 'ItemQuery';
  connection?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  message: Scalars['String']['output'];
  name: Scalars['String']['output'];
  organisationType: Scalars['String']['output'];
  phone: Scalars['String']['output'];
  type: Scalars['String']['output'];
  who: Scalars['String']['output'];
};

export type JoinRequest = {
  __typename?: 'JoinRequest';
  aboutCharity?: Maybe<Scalars['String']['output']>;
  charityAddress?: Maybe<Scalars['String']['output']>;
  charityName?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  jobTitle?: Maybe<Scalars['String']['output']>;
  localAuthority: Scalars['String']['output'];
  name: Scalars['String']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  requestTime: Scalars['Float']['output'];
  school?: Maybe<Scalars['String']['output']>;
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

export type LocalAuthorityRegisterRequest = {
  __typename?: 'LocalAuthorityRegisterRequest';
  email: Scalars['String']['output'];
  localAuthority: Scalars['String']['output'];
  message: Scalars['String']['output'];
  name: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

export type LocalAuthorityUser = {
  __typename?: 'LocalAuthorityUser';
  department: Scalars['String']['output'];
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  jobTitle: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  name: Scalars['String']['output'];
  nameId: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  phone: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  deleteDeniedJoinRequest: Scalars['Boolean']['output'];
  insertItemQuery: Scalars['Boolean']['output'];
  insertJoinRequest: Scalars['Boolean']['output'];
  insertLocalAuthorityRegisterRequest: Scalars['Boolean']['output'];
  insertSignUpData: Scalars['Boolean']['output'];
  registerLocalAuthority: Scalars['Boolean']['output'];
  updateCharityProfile: Scalars['Boolean']['output'];
  updateJoinRequest: Scalars['Boolean']['output'];
  updateSchoolProfile: Scalars['Boolean']['output'];
};


export type MutationDeleteDeniedJoinRequestArgs = {
  name: Scalars['String']['input'];
};


export type MutationInsertItemQueryArgs = {
  connection?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  message: Scalars['String']['input'];
  name: Scalars['String']['input'];
  organisationType: Scalars['String']['input'];
  phone: Scalars['String']['input'];
  type: Scalars['String']['input'];
  who: Scalars['String']['input'];
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
  school?: InputMaybe<Scalars['String']['input']>;
  type: Scalars['String']['input'];
};


export type MutationInsertLocalAuthorityRegisterRequestArgs = {
  email: Scalars['String']['input'];
  localAuthority: Scalars['String']['input'];
  message: Scalars['String']['input'];
  name: Scalars['String']['input'];
  type: Scalars['String']['input'];
};


export type MutationInsertSignUpDataArgs = {
  email: Scalars['String']['input'];
  id: Scalars['String']['input'];
  name: Scalars['String']['input'];
  nameId: Scalars['String']['input'];
  type: Scalars['String']['input'];
};


export type MutationRegisterLocalAuthorityArgs = {
  department: Scalars['String']['input'];
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  jobTitle: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  name: Scalars['String']['input'];
  nameId: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  phone: Scalars['String']['input'];
};


export type MutationUpdateCharityProfileArgs = {
  key: Scalars['String']['input'];
  value: Scalars['String']['input'];
};


export type MutationUpdateJoinRequestArgs = {
  localAuthority: Scalars['String']['input'];
  name: Scalars['String']['input'];
  status: Scalars['String']['input'];
};


export type MutationUpdateSchoolProfileArgs = {
  key: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type ProfileItems = {
  __typename?: 'ProfileItems';
  actionText?: Maybe<Scalars['String']['output']>;
  items?: Maybe<Scalars['String']['output']>;
  whatToExpect?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  getCharityProfile?: Maybe<CharityProfile>;
  getJoinRequests: Array<JoinRequest>;
  getLocalAuthorities: Array<LocalAuthority>;
  getLocalAuthorityUser: LocalAuthorityUser;
  getRegisteredSchools: Array<School>;
  getRegisteredSchoolsByLa: Array<School>;
  getSchoolByName: School;
  getSchoolJoinRequestsByLa: Array<JoinRequest>;
  getSchoolProfile?: Maybe<SchoolProfile>;
  getSchools: Array<School>;
  getSchoolsByLa: Array<School>;
  getSchoolsNearby: Array<School>;
  getSignUpData?: Maybe<SignUpData>;
};


export type QueryGetCharityProfileArgs = {
  id: Scalars['String']['input'];
  name: Scalars['String']['input'];
};


export type QueryGetLocalAuthorityUserArgs = {
  email: Scalars['String']['input'];
};


export type QueryGetRegisteredSchoolsByLaArgs = {
  localAuthority: Scalars['String']['input'];
};


export type QueryGetSchoolByNameArgs = {
  name: Scalars['String']['input'];
};


export type QueryGetSchoolJoinRequestsByLaArgs = {
  localAuthority: Scalars['String']['input'];
};


export type QueryGetSchoolProfileArgs = {
  id: Scalars['String']['input'];
  name: Scalars['String']['input'];
};


export type QueryGetSchoolsByLaArgs = {
  name: Scalars['String']['input'];
};


export type QueryGetSchoolsNearbyArgs = {
  distance: Scalars['Float']['input'];
  postcode: Scalars['String']['input'];
};


export type QueryGetSignUpDataArgs = {
  id: Scalars['String']['input'];
};

export type School = {
  __typename?: 'School';
  address3?: Maybe<Scalars['String']['output']>;
  county?: Maybe<Scalars['String']['output']>;
  distance?: Maybe<Scalars['String']['output']>;
  isLocalAuthorityRegistered?: Maybe<Scalars['Boolean']['output']>;
  localAuthority: Scalars['String']['output'];
  locality?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  postcode?: Maybe<Scalars['String']['output']>;
  registered: Scalars['Boolean']['output'];
  street?: Maybe<Scalars['String']['output']>;
  town?: Maybe<Scalars['String']['output']>;
  urn: Scalars['ID']['output'];
  website?: Maybe<Scalars['String']['output']>;
};

export type SchoolProfile = {
  __typename?: 'SchoolProfile';
  about?: Maybe<Scalars['String']['output']>;
  donate?: Maybe<ProfileItems>;
  excess?: Maybe<ProfileItems>;
  header?: Maybe<SchoolProfileHeader>;
  id: Scalars['String']['output'];
  localAuthority: Scalars['String']['output'];
  name: Scalars['String']['output'];
  postcode: Scalars['String']['output'];
  request?: Maybe<ProfileItems>;
};

export type SchoolProfileHeader = {
  __typename?: 'SchoolProfileHeader';
  email?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  uniformPolicy?: Maybe<Scalars['String']['output']>;
  website?: Maybe<Scalars['String']['output']>;
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
  name: Scalars['String']['output'];
  nameId: Scalars['String']['output'];
  type: Scalars['String']['output'];
};
