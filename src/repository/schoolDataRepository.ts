import { WithId } from 'mongodb';
import { InstituteSearchResult, School, Type } from '../../appsync';
import { BaseRepository } from './baseRepository';

export class SchoolDataRepository extends BaseRepository<School> {
  private static instance: SchoolDataRepository;

  static getInstance(): SchoolDataRepository {
    if (!this.instance) {
      this.instance = new SchoolDataRepository('SchoolData');
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

  public async setToRegistered(name: string, urn: string): Promise<boolean> {
    return (await this.collection.updateOne({ name, urn }, { $set: { registered: true } }))
      .acknowledged;
  }

  public async unregister(name: string, urn: string): Promise<boolean> {
    return (await this.collection.updateOne({ name, urn }, { $set: { registered: false } }))
      .acknowledged;
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
    maxDistance: number,
    type: Type
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

    return (await res.toArray()).reduce((acc, { name, distance, profile, urn, registered }) => {
      const hasProfileItems = profile && profile?.length > 0;

      const productTypes = hasProfileItems
        ? (profile[0]?.[type]?.productTypes as number[]) ?? []
        : [];
      acc.push({ name, distance: distance ?? 0, productTypes, id: urn, registered });
      return acc;
    }, [] as InstituteSearchResult[]);
  }
}
