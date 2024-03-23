import { MongoClientOptions } from 'mongodb';

export const clientOptions: MongoClientOptions = {
  authMechanism: 'MONGODB-AWS',
  authSource: '$external',
};
