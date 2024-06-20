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

export type AdminStats = {
  __typename?: 'AdminStats';
  joinRequests: JoinRequestStats;
  la: LocalAuthorityStats;
  registeredCharities: Scalars['Int']['output'];
  registeredSchools: Scalars['Int']['output'];
};

export type Charity = {
  __typename?: 'Charity';
  about: Scalars['String']['output'];
  address: Scalars['String']['output'];
  distance?: Maybe<Scalars['Float']['output']>;
  id: Scalars['String']['output'];
  localAuthority: Scalars['String']['output'];
  name: Scalars['String']['output'];
  postcode?: Maybe<Scalars['String']['output']>;
  profile?: Maybe<Array<Maybe<CharityProfile>>>;
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
  postcode?: Maybe<Scalars['String']['output']>;
  request?: Maybe<ProfileItems>;
};

export type CharityProfileHeader = {
  __typename?: 'CharityProfileHeader';
  address?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  website?: Maybe<Scalars['String']['output']>;
};

export type CharityUser = {
  __typename?: 'CharityUser';
  charityId: Scalars['String']['output'];
  charityName: Scalars['String']['output'];
  email: Scalars['String']['output'];
  jobTitle: Scalars['String']['output'];
  name: Scalars['String']['output'];
  phone: Scalars['String']['output'];
};

export type InstituteSearchResult = {
  __typename?: 'InstituteSearchResult';
  distance: Scalars['Float']['output'];
  id: Scalars['String']['output'];
  location: Point;
  name: Scalars['String']['output'];
  productTypes: Array<Scalars['Int']['output']>;
  registered: Scalars['Boolean']['output'];
};

export type ItemQuery = {
  __typename?: 'ItemQuery';
  connection?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  message: Scalars['String']['output'];
  name: Scalars['String']['output'];
  organisationId: Scalars['String']['output'];
  organisationName: Scalars['String']['output'];
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
  id: Scalars['String']['output'];
  jobTitle?: Maybe<Scalars['String']['output']>;
  localAuthority: Scalars['String']['output'];
  name: Scalars['String']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  postcode?: Maybe<Scalars['String']['output']>;
  requestTime: Scalars['Float']['output'];
  school?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  type: Scalars['String']['output'];
  urn?: Maybe<Scalars['String']['output']>;
};

export type JoinRequestStats = {
  __typename?: 'JoinRequestStats';
  charity: Scalars['Int']['output'];
  school: Scalars['Int']['output'];
};

export type LaStats = {
  __typename?: 'LaStats';
  charityRequests: Scalars['Int']['output'];
  privacyPolicyAccepted: Scalars['Boolean']['output'];
  schoolRequests: Scalars['Int']['output'];
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

export type LocalAuthorityStats = {
  __typename?: 'LocalAuthorityStats';
  joined: Scalars['Int']['output'];
  notJoined: Scalars['Int']['output'];
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
  privacyPolicyAccepted?: Maybe<Scalars['Boolean']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  acceptPrivacyPolicy: Scalars['Boolean']['output'];
  deleteCharityProfile?: Maybe<Scalars['Boolean']['output']>;
  deleteDeniedJoinRequest: Scalars['Boolean']['output'];
  deleteSchoolProfile?: Maybe<Scalars['Boolean']['output']>;
  deleteSignUpData?: Maybe<Scalars['Boolean']['output']>;
  insertItemQuery: Scalars['Boolean']['output'];
  insertJoinRequest: Scalars['Boolean']['output'];
  insertLocalAuthorityRegisterRequest: Scalars['Boolean']['output'];
  insertSignUpData: Scalars['Boolean']['output'];
  registerLocalAuthority: Scalars['Boolean']['output'];
  updateCharityProfile: Scalars['Boolean']['output'];
  updateJoinRequest: Scalars['Boolean']['output'];
  updateSchoolProfile: Scalars['Boolean']['output'];
};


export type MutationAcceptPrivacyPolicyArgs = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  nameId: Scalars['String']['input'];
};


export type MutationDeleteCharityProfileArgs = {
  id: Scalars['String']['input'];
  name: Scalars['String']['input'];
};


export type MutationDeleteDeniedJoinRequestArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteSchoolProfileArgs = {
  id: Scalars['String']['input'];
  name: Scalars['String']['input'];
};


export type MutationDeleteSignUpDataArgs = {
  email: Scalars['String']['input'];
  id: Scalars['String']['input'];
};


export type MutationInsertItemQueryArgs = {
  connection?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  message: Scalars['String']['input'];
  name: Scalars['String']['input'];
  organisationId: Scalars['String']['input'];
  organisationName: Scalars['String']['input'];
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
  postcode?: InputMaybe<Scalars['String']['input']>;
  school?: InputMaybe<Scalars['String']['input']>;
  type: Scalars['String']['input'];
  urn?: InputMaybe<Scalars['String']['input']>;
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
  id: Scalars['String']['input'];
  localAuthority: Scalars['String']['input'];
  name: Scalars['String']['input'];
  status: Scalars['String']['input'];
};


export type MutationUpdateSchoolProfileArgs = {
  key: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type Point = {
  __typename?: 'Point';
  coordinates: Array<Scalars['Float']['output']>;
  type: Scalars['String']['output'];
};

export type ProfileItems = {
  __typename?: 'ProfileItems';
  actionText?: Maybe<Scalars['String']['output']>;
  items?: Maybe<Scalars['String']['output']>;
  productTypes?: Maybe<Array<Maybe<Scalars['Float']['output']>>>;
  whatToExpect?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  getAdminTileStats: AdminStats;
  getCharities: Array<Charity>;
  getCharitiesByLa: Array<Maybe<Charity>>;
  getCharitiesNearby: Array<Charity>;
  getCharitiesNearbyWithProfile: Array<InstituteSearchResult>;
  getCharityJoinRequestsByLa: Array<JoinRequest>;
  getCharityProfile?: Maybe<CharityProfile>;
  getJoinRequests: Array<JoinRequest>;
  getLaStats: LaStats;
  getLocalAuthorities: Array<LocalAuthority>;
  getLocalAuthorityUser: LocalAuthorityUser;
  getRegisteredSchools: Array<School>;
  getRegisteredSchoolsByLa: Array<School>;
  getSchool: School;
  getSchoolJoinRequestsByLa: Array<JoinRequest>;
  getSchoolProfile?: Maybe<SchoolProfile>;
  getSchools: Array<School>;
  getSchoolsByLa: Array<School>;
  getSchoolsNearby: Array<School>;
  getSchoolsNearbyWithProfile: Array<InstituteSearchResult>;
  getSignUpData?: Maybe<SignUpData>;
  hasCharityProfile: Scalars['Boolean']['output'];
  hasSchoolProfile: Scalars['Boolean']['output'];
};


export type QueryGetCharitiesByLaArgs = {
  name: Scalars['String']['input'];
};


export type QueryGetCharitiesNearbyArgs = {
  distance: Scalars['Float']['input'];
  postcode: Scalars['String']['input'];
};


export type QueryGetCharitiesNearbyWithProfileArgs = {
  distance: Scalars['Float']['input'];
  postcode: Scalars['String']['input'];
  type: Type;
};


export type QueryGetCharityJoinRequestsByLaArgs = {
  localAuthority: Scalars['String']['input'];
};


export type QueryGetCharityProfileArgs = {
  id: Scalars['String']['input'];
  name: Scalars['String']['input'];
};


export type QueryGetLaStatsArgs = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  nameId: Scalars['String']['input'];
};


export type QueryGetLocalAuthorityUserArgs = {
  email: Scalars['String']['input'];
};


export type QueryGetRegisteredSchoolsByLaArgs = {
  localAuthority: Scalars['String']['input'];
};


export type QueryGetSchoolArgs = {
  name: Scalars['String']['input'];
  urn: Scalars['String']['input'];
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


export type QueryGetSchoolsNearbyWithProfileArgs = {
  distance: Scalars['Float']['input'];
  postcode: Scalars['String']['input'];
  type: Type;
};


export type QueryGetSignUpDataArgs = {
  id: Scalars['String']['input'];
};


export type QueryHasCharityProfileArgs = {
  id: Scalars['String']['input'];
  name: Scalars['String']['input'];
};


export type QueryHasSchoolProfileArgs = {
  id: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type School = {
  __typename?: 'School';
  address3?: Maybe<Scalars['String']['output']>;
  county?: Maybe<Scalars['String']['output']>;
  distance?: Maybe<Scalars['Float']['output']>;
  hasJoinRequest?: Maybe<Scalars['Boolean']['output']>;
  isLocalAuthorityRegistered?: Maybe<Scalars['Boolean']['output']>;
  localAuthority: Scalars['String']['output'];
  locality?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  postcode?: Maybe<Scalars['String']['output']>;
  profile?: Maybe<Array<Maybe<SchoolProfile>>>;
  registered: Scalars['Boolean']['output'];
  registrationState?: Maybe<Scalars['String']['output']>;
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
  schoolId: Scalars['String']['output'];
  schoolName: Scalars['String']['output'];
};

export type SignUpData = {
  __typename?: 'SignUpData';
  email: Scalars['String']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  nameId: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

export enum Type {
  Donate = 'donate',
  Excess = 'excess',
  Request = 'request'
}
