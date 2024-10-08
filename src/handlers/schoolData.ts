import os from 'os';
import { AnyBulkWriteOperation, MongoClient } from 'mongodb';
import { checkIfDefinedElseDefault } from '../shared/check';
import { loadCsvDataFromZip } from '../shared/file';
import { convertEastingNorthingtoLatLng } from '../shared/location';
import { logger } from '../shared/logger';
import { checkIfObjectValuesMatch, removePropertiesFromObject } from '../shared/object';
import { downloadSchoolDataFileLocally } from '../shared/puppeteer';
// import { SchoolDataRepository } from '../repository/schoolDataRepository';

// TODO fully replace with repo
// const schoolDataRepository = SchoolDataRepository.getInstance();

const mongoClient = new MongoClient(
  checkIfDefinedElseDefault(process?.env?.MONGO_URL, 'mongodb://localhost:27017/'),
  {
    authMechanism: 'MONGODB-AWS',
    authSource: '$external',
  }
);

export const lambdaHandler = async (): Promise<{ statusCode: number }> => {
  await downloadSchoolDataFileLocally();

  const zipFile = `${os.tmpdir()}/extract.zip`;
  const data = loadCsvDataFromZip<Record<string, string>[]>(zipFile);

  const openSchools = data.filter(
    ({
      'EstablishmentStatus (name)': status,
      'TypeOfEstablishment (name)': type,
      'LA (name)': laName,
    }) => status === 'Open' && !type.includes('independent') && laName !== 'Does not apply'
  );

  const localAuthorities = openSchools.reduce(
    (acc, { 'LA (name)': name, 'LA (code)': code }) => {
      const match = acc.find((la) => la.code === code);
      if (!match) {
        acc.push({ name, code });
      }

      return acc;
    },
    [] as Record<string, string>[]
  );

  logger.info(`Total schools: ${openSchools.length}`);
  logger.info(`Total local authorities: ${localAuthorities.length}`);

  try {
    await mongoClient.connect();
    const database = mongoClient.db('D2E');
    const schoolCollection = database.collection('SchoolData');

    const currentSchools = await schoolCollection.find().toArray();

    const schoolUpdateOperations = openSchools.reduce(
      (
        acc,
        {
          URN: urn,
          EstablishmentName: name,
          'LA (name)': localAuthority,
          Postcode: postcode,
          Easting: easting,
          Northing: northing,
          TelephoneNum: phone,
          Street: street,
          Locality: locality,
          Address3: address3,
          Town: town,
          'County (name)': county,
          SchoolWebsite: website,
        }
      ) => {
        const match = currentSchools.find((school) => school.urn === urn);
        const [longitude, latitude] = convertEastingNorthingtoLatLng(easting, northing);

        const entry = {
          urn,
          name,
          localAuthority,
          postcode,
          latitude,
          longitude,
          phone,
          street,
          locality,
          address3,
          town,
          county,
          website,
        };

        if (!match || !checkIfObjectValuesMatch(Object.keys(entry), match, entry)) {
          const updatedEntry = {
            ...removePropertiesFromObject(['latitude', 'longitude'], entry),
            location: {
              type: 'Point',
              coordinates: [longitude, latitude],
            },
          };
          acc.push({
            updateOne: {
              filter: { urn },
              update: {
                $set: updatedEntry,
                $setOnInsert: { registered: false },
              },
              upsert: true,
            },
          });
        }

        return acc;
      },
      [] as AnyBulkWriteOperation[]
    );

    logger.info(`${schoolUpdateOperations.length} School update operations`);

    if (schoolUpdateOperations.length > 0) {
      await schoolCollection.bulkWrite(schoolUpdateOperations, {
        ordered: false,
      });
    }

    const localAuthorityCollection = database.collection('LocalAuthorityData');
    const currentLocalAuthorities = await localAuthorityCollection.find().toArray();
    const localAuthorityUpdateOperations = localAuthorities.reduce((acc, { name, code }) => {
      const match = currentLocalAuthorities.find((la) => la.code === code);
      const entry = { name, code };

      if (!match || !checkIfObjectValuesMatch(Object.keys(entry), match, entry)) {
        acc.push({
          updateOne: {
            filter: { code },
            update: { $set: entry, $setOnInsert: { registered: false } },
            upsert: true,
          },
        });
      }

      return acc;
    }, [] as AnyBulkWriteOperation[]);

    logger.info(`${localAuthorityUpdateOperations.length} Local Authority update operations`);
    if (localAuthorityUpdateOperations.length > 0) {
      await localAuthorityCollection.bulkWrite(localAuthorityUpdateOperations, {
        ordered: false,
      });
    }
  } catch (error) {
    logger.error(error);
  } finally {
    await mongoClient.close();
  }

  return {
    statusCode: 200,
  };
};
