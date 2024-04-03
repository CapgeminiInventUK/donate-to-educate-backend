import { z } from 'zod';
import { Type as _Type } from '../../appsync';
const Type = { ..._Type };

// Private resolver schemas

export const registerLocalAuthoritySchema = z.object({
  department: z.string().min(1),
  email: z.string().email(),
  firstName: z.string().min(1),
  jobTitle: z.string().min(1),
  lastName: z.string().min(1),
  name: z.string().min(1),
  nameId: z.string().min(1),
  notes: z.string().min(1).optional(),
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
  aboutCharity: z.string().min(1).optional(),
  charityAddress: z.string().min(1).optional(),
  charityName: z.string().min(1).optional(),
  email: z.string().email(),
  jobTitle: z.string().min(1).optional(),
  localAuthority: z.string().min(1),
  name: z.string().min(1),
  phone: z.string().min(1).optional(),
  school: z.string().min(1).optional(),
  type: z.string().min(1),
});

export const insertItemQuerySchema = z.object({
  connection: z.string().min(1).optional(),
  email: z.string().email(),
  message: z.string().min(1),
  name: z.string().min(1),
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

export const getSchoolByNameSchema = z.object({
  name: z.string().min(1),
});

export const getLocalAuthorityUserSchema = z.object({
  email: z.string().email(),
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
  postcode: z.string().min(1),
  type: z.enum([Type.Donate, Type.Excess, Type.Request]),
});

export const getCharitiesNearbySchema = z.object({
  distance: z.number(),
  postcode: z.string().min(1),
});

export const getCharitiesNearbyWithProfileSchema = z.object({
  distance: z.number(),
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
