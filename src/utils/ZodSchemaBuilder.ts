import { z, ZodObject, ZodRawShape, ZodSchema } from 'zod';

export class ZodSchemaBuilder<T> {
  private fields: Record<string, ZodSchema<T>> = {};

  addField(name: string, type: ZodSchema<any>) {
    this.fields[name] = type;
    return this;
  }

  build(): ZodObject<ZodRawShape> {
    return z.object(this.fields);
  }
}
