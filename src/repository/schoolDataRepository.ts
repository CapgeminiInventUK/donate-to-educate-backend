import { Collection, Db, Filter, MongoClient, WithId } from 'mongodb';
import { School } from '../../appsync';

export class SchoolDataRepository {
  private static instance: SchoolDataRepository;
  private readonly client: MongoClient;
  private readonly db: Db;
  private readonly collection: Collection<School>;

  private constructor() {
    this.client = new MongoClient(
      process?.env?.MONGODB_CONNECTION_STRING ?? 'mongodb://localhost:27017/',
      { authMechanism: 'MONGODB-AWS', authSource: '$external' }
    );
    this.db = this.client.db('D2E');
    this.collection = this.db.collection<School>('SchoolData');
  }

  static getInstance(): SchoolDataRepository {
    if (!this.instance) {
      this.instance = new SchoolDataRepository();
    }
    return this.instance;
  }

  private async getByQuery(
    query: Filter<School>,
    projectedFields?: Record<string, 0 | 1>
  ): Promise<WithId<School>[]> {
    const cursor = projectedFields
      ? this.collection.find(query).project<WithId<School>>(projectedFields)
      : this.collection.find(query);

    if (!(await cursor.hasNext())) {
      return [];
    }

    return await cursor.toArray();
  }

  private async getOne(query: Filter<School>): Promise<WithId<School> | undefined> {
    const result = await this.collection.findOne(query);
    if (!result) {
      return undefined;
    }

    return result;
  }

  public async list(projectedFields: Record<string, 0 | 1>): Promise<WithId<School>[]> {
    return await this.getByQuery({}, projectedFields);
  }

  public async getByLa(localAuthority: string): Promise<WithId<School>[]> {
    return await this.getByQuery({ localAuthority });
  }

  public async getByName(name: string): Promise<WithId<School> | undefined> {
    return await this.getOne({ name });
  }

  public async getRegistered(): Promise<WithId<School>[]> {
    return await this.getByQuery({ registered: true });
  }

  public async getRegisteredByLa(localAuthority: string): Promise<WithId<School>[]> {
    return await this.getByQuery({ registered: true, localAuthority });
  }

  public async getSchoolsNearby(
    longitude: number,
    latitude: number,
    maxDistance: number
  ): Promise<School[]> {
    const res = this.collection.aggregate<School>([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          distanceField: 'distance',
          maxDistance,
        },
      },
    ]);

    return await res.toArray();
  }
}
