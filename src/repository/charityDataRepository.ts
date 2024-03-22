import { WithId } from 'mongodb';
import { Charity } from '../../appsync';
import { BaseRepository } from './baseRepository';
import { clientOptions } from './config';
import { convertPostcodeToLatLng } from '../shared/postcode';

export class CharityDataRepository extends BaseRepository<Charity> {
  private static instance: CharityDataRepository;

  static getInstance(
    url = process?.env?.MONGODB_CONNECTION_STRING,
    isTest = false
  ): CharityDataRepository {
    if (!this.instance) {
      this.instance = new CharityDataRepository(
        'CharityData',
        url ?? '',
        isTest ? undefined : clientOptions
      );
    }
    return this.instance;
  }

  public async list(projectedFields: Record<string, number>): Promise<WithId<Charity>[]> {
    return await this.getByQuery({}, projectedFields);
  }

  public async getByLa(localAuthority: string): Promise<WithId<Charity>[]> {
    return await this.getByQuery({ localAuthority });
  }

  public async getByName(name: string): Promise<WithId<Charity> | undefined> {
    return await this.getOne({ name });
  }

  public async getById(id: string): Promise<WithId<Charity> | undefined> {
    return await this.getOne({ id });
  }

  public async getRegisteredCharityCount(): Promise<number> {
    return await this.getCount({});
  }

  public async insert(charity: Charity): Promise<boolean> {
    return (await this.collection.insertOne(charity)).acknowledged;
  }

  public async updatePostcode(
    id: string,
    name: string,
    localAuthority: string,
    postcode: string
  ): Promise<boolean> {
    const [longitude, latitude] = await convertPostcodeToLatLng(postcode);
    return (
      await this.collection.updateOne(
        { name, id, localAuthority },
        {
          $set: {
            postcode,
            location: {
              type: 'Point',
              coordinates: [longitude, latitude],
            },
          },
        },
        { upsert: true }
      )
    ).acknowledged;
  }

  public async getCharitiesNearby(
    longitude: number,
    latitude: number,
    maxDistance: number
  ): Promise<Charity[]> {
    const res = this.collection.aggregate<Charity>([
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
