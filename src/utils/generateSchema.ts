import { ZodObject, ZodRawShape, z } from 'zod';
import { ZodSchemaBuilder } from './ZodSchemaBuilder';

export function generateSchema<T extends Record<string, any>>(type: T): ZodObject<ZodRawShape> {
  const builder = new ZodSchemaBuilder<T>();

  for (const key in type) {
    let zodType;

    switch (key) {
      case 'firstName' || 'lastName' || 'department' || 'jobTitle' || 'nameId' || 'phone': {
        zodType = z.string().min(1);
      }
      case 'email': {
        zodType = z.string().email();
      }
      case 'notes': {
        zodType = z.string().optional();
      }
    }

    if (!zodType) {
      throw new Error(`Unrecognised parameter ${zodType} within payload`);
    }

    builder.addField(key, zodType);
  }

  return builder.build();
}

// switch (key) {
//   case 'name' ||
//     'firstName' ||
//     'lastName' ||
//     'department' ||
//     'jobTitle' ||
//     'nameId' ||
//     'id' ||
//     'type' ||
//     'key' ||
//     'value' ||
//     'localAuthority' ||
//     'status': {
//     zodType = z.string().min(1);
//   }
//   case 'phone': {
//     zodType = z.string().min(1);
//   }
//   case 'email': {
//     zodType = z.string().email();
//   }
//   case 'notes': {
//     zodType = z.string().optional();
//   }
// }

// name: z.string().min(1),
//   firstName: z.string().min(1),
//   lastName: z.string().min(1),
//   email: z.string().email(),
//   phone: z.string().min(1),
//   department: z.string().min(1),
//   jobTitle: z.string().min(1),
//   notes: z.string().min(1).optional(),
//   nameId: z.string().min(1),

// department: Scalars['String']['input'];
//   email: Scalars['String']['input'];
//   firstName: Scalars['String']['input'];
//   jobTitle: Scalars['String']['input'];
//   lastName: Scalars['String']['input'];
//   name: Scalars['String']['input'];
//   nameId: Scalars['String']['input'];
//   notes?: InputMaybe<Scalars['String']['input']>;
//   phone: Scalars['String']['input'];
