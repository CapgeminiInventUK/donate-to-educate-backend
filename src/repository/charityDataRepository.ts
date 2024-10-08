import { WithId } from 'mongodb';
import { Charity, InstituteSearchResult, Point, SearchResult, Type } from '../../appsync';
import { convertPostcodeToLatLng } from '../shared/postcode';
import { BaseRepository } from './baseRepository';

export class CharityDataRepository extends BaseRepository<Charity> {
  private static instance: CharityDataRepository;

  static getInstance(): CharityDataRepository {
    if (!this.instance) {
      this.instance = new CharityDataRepository('CharityData');
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

  public async deleteCharity(name: string, id: string): Promise<boolean> {
    return (await this.collection.deleteOne({ name, id })).acknowledged;
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
          includeLocs: 'location',
        },
      },
    ]);

    return await res.toArray();
  }

  public async getCharitiesNearbyWithProfile(
    longitude: number,
    latitude: number,
    maxDistance: number,
    limit: number,
    type: Type
  ): Promise<InstituteSearchResult> {
    const res = this.collection.aggregate<Charity & { location: Point }>([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          distanceField: 'distance',
          maxDistance,
          includeLocs: 'location',
        },
      },
      {
        $limit: limit,
      },
      {
        $lookup: {
          from: 'CharityProfile',
          localField: 'id',
          foreignField: 'id',
          as: 'profile',
        },
      },
    ]);

    const resultsArray = (await res.toArray()).reduce(
      (acc, { name, distance, profile, id, location }) => {
        const hasProfileItems = profile && profile?.length > 0;

        const productTypes = hasProfileItems
          ? (profile[0]?.[type]?.productTypes as number[]) ?? []
          : [];
        acc.push({
          name,
          distance: distance ?? 0,
          productTypes,
          id,
          registered: true,
          location,
        });
        return acc;
      },
      [] as SearchResult[]
    );

    return {
      searchLocation: {
        type: 'Point',
        coordinates: [longitude, latitude],
      },
      results: resultsArray,
    };
  }
}
