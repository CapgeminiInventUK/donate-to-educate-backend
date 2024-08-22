import { z } from 'zod';

export enum Type {
  Donate = 'donate',
  Excess = 'excess',
  Request = 'request',
}

export enum UserType {
  La = 'localAuthority',
  Charity = 'charity',
  School = 'school',
}

// Private resolver schemas

export const registerLocalAuthoritySchema = z.object({
  department: z.string().min(1),
  email: z.string().email(),
  firstName: z.string().min(1),
  jobTitle: z.string().min(1),
  lastName: z.string().min(1),
  name: z.string().min(1),
  nameId: z.string().min(1),
  notes: z.string().optional().nullable(),
  phone: z.string().min(1),
});

export const updateJoinRequestSchema = z.object({
  id: z.string().min(1),
  localAuthority: z.string().min(1),
  name: z.string().min(1),
  status: z.string().min(1),
});

export const updateSchoolProfileSchema = z.object({
  key: z.string().min(1),
  value: z.string().min(1),
});

export const updateCharityProfileSchema = z.object({
  key: z.string().min(1),
  value: z.string().min(1),
});

export const insertSignUpDataSchema = z.object({
  email: z.string().email(),
  id: z.string().min(1),
  name: z.string().min(1),
  nameId: z.string().min(1),
  type: z.string().min(1),
});

export const insertJoinRequestSchema = z.object({
  aboutCharity: z.string().optional().nullable(),
  charityAddress: z.string().optional().nullable(),
  charityName: z.string().optional().nullable(),
  email: z.string().email(),
  jobTitle: z.string().optional().nullable(),
  localAuthority: z.string().min(1),
  name: z.string().min(1),
  phone: z.string().optional().nullable(),
  school: z.string().optional().nullable(),
  type: z.string().min(1),
  urn: z.string().optional().nullable(),
  postcode: z.string().optional().nullable(),
});

export const insertItemQuerySchema = z.object({
  connection: z.string().optional().nullable(),
  email: z.string().email(),
  message: z.string().min(1),
  name: z.string().min(1),
  organisationName: z.string().min(1),
  organisationId: z.string().min(1),
  organisationType: z.string().min(1),
  phone: z.string().min(1),
  type: z.string().min(1),
  who: z.string().min(1),
});

export const insertLocalAuthorityRegisterRequestSchema = z.object({
  email: z.string().email(),
  localAuthority: z.string().min(1),
  message: z.string().min(1),
  name: z.string().min(1),
  type: z.string().min(1),
});

export const deleteDeniedJoinRequestSchema = z.object({
  id: z.string().min(1),
});

export const deleteSchoolProfileSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
});

export const acceptPrivacyPolicySchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  nameId: z.string().min(1),
});

export const deleteCharityProfileSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
});

// Public resolver schemas

export const getSchoolSchema = z.object({
  name: z.string().min(1),
  urn: z.string().min(1),
});

export const getUserSchema = z.object({
  email: z.string().email(),
});

export const getUsersByIdSchema = z.object({
  id: z.string().min(1),
});

export const getSchoolsByLaSchema = z.object({
  name: z.string().min(1),
});

export const getSchoolProfileSchema = z.object({
  name: z.string().min(1),
  id: z.string().min(1),
});

export const getCharityProfileSchema = z.object({
  name: z.string().min(1),
  id: z.string().min(1),
});

export const getSignUpDataSchema = z.object({
  id: z.string().min(1),
});

export const getRegisteredSchoolsByLaSchema = z.object({
  localAuthority: z.string().min(1),
});

export const getSchoolJoinRequestsByLaSchema = z.object({
  localAuthority: z.string().min(1),
});

export const getSchoolsNearbySchema = z.object({
  distance: z.number(),
  postcode: z.string().min(1),
});

export const getSchoolsNearbyWithProfileSchema = z.object({
  distance: z.number(),
  limit: z.number(),
  postcode: z.string().min(1),
  type: z.enum([Type.Donate, Type.Excess, Type.Request]),
});

export const getCharitiesNearbySchema = z.object({
  distance: z.number(),
  postcode: z.string().min(1),
});

export const getCharitiesNearbyWithProfileSchema = z.object({
  distance: z.number(),
  limit: z.number(),
  postcode: z.string().min(1),
  type: z.enum([Type.Donate, Type.Excess, Type.Request]),
});

export const getLaStatsSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  nameId: z.string().min(1),
});

export const getCharitiesByLaSchema = z.object({
  name: z.string().min(1),
});

export const getCharityJoinRequestsByLaSchema = z.object({
  localAuthority: z.string().min(1),
});

export const updateUserSchema = z.object({
  userType: z.enum([UserType.La, UserType.Charity, UserType.School]),
  name: z.string().min(1),
  id: z.string().min(1),
  institutionName: z.string().min(1),
  email: z.string().min(1),
  phone: z.string().min(1),
  jobTitle: z.string().min(1),
  department: z.string().optional().nullable(),
});
