import { WithId } from 'mongodb';
import { InstituteSearchResult, School } from '../../appsync';
import { BaseRepository } from './baseRepository';
import { clientOptions } from './config';

export class SchoolDataRepository extends BaseRepository<School> {
  private static instance: SchoolDataRepository;

  static getInstance(
    url = process?.env?.MONGODB_CONNECTION_STRING,
    isTest = false
  ): SchoolDataRepository {
    if (!this.instance) {
      this.instance = new SchoolDataRepository(
        'SchoolData',
        url ?? '',
        isTest ? undefined : clientOptions
      );
    }
    return this.instance;
  }

  public async list(projectedFields: Record<string, number>): Promise<WithId<School>[]> {
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

  public async getRegisteredSchoolsCount(): Promise<number> {
    return await this.getCount({ registered: true });
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

  public async getSchoolsNearbyWithProfile(
    longitude: number,
    latitude: number,
    maxDistance: number
  ): Promise<InstituteSearchResult[]> {
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
      {
        $lookup: {
          from: 'SchoolProfile',
          localField: 'urn',
          foreignField: 'id',
          as: 'profile',
        },
      },
    ]);

    const array = await res.toArray();
    return array.reduce(
      (acc, { name, distance, profile }) => {
        const hasProfileItems = profile && profile?.length > 0;

        const productTypes = hasProfileItems
          ? (profile[0]?.donate?.productTypes as number[]) ?? []
          : [];
        acc.push({ name, distance: distance ?? 0, productTypes });
        return acc;
      },
      [] as { name: string; distance: number; productTypes: number[] }[]
    );
  }
}
