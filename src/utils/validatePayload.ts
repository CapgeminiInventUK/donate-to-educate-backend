import { generateSchema } from './generateSchema';

export const validatePayload = <T extends Record<string, any>>(params: T) => {
  const schema = generateSchema(params);
  schema.parse(params);
};
