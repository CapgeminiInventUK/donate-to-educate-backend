import { z } from 'zod';

export const registerLocalAuthoritySchema = z.object({
  department: z.string().min(1),
  email: z.string().email(),
  firstName: z.string().min(1).optional(),
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
  name: z.string().min(1),
});
