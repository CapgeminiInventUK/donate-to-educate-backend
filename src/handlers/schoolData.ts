import { downloadSchoolDataFileLocally } from '../shared/puppeteer';
import { loadCsvDataFromZip } from '../shared/file';
import { checkIfObjectValuesMatch } from '../shared/object';
import { logger } from '../shared/logger';
// import { convertEastingNorthingtoLatLng } from '../shared/location';
import os from 'os';
import { AnyBulkWriteOperation, MongoClient } from 'mongodb';

export const lambdaHandler = async (): Promise<{ statusCode: number }> => {
  await downloadSchoolDataFileLocally();

  const zipFile = `${os.tmpdir()}/extract.zip`;
  const extractPath = `${os.tmpdir()}/extracted`;

  const data = await loadCsvDataFromZip<Record<string, string>[]>(zipFile, extractPath);

  const openSchools = data.filter(
    ({ 'EstablishmentStatus (name)': status, 'TypeOfEstablishment (name)': type }) =>
      status === 'Open' && !type.includes('independent')
  );

  const localAuthorities = data.reduce((acc, { 'LA (name)': name, 'LA (code)': code }) => {
    const match = acc.find((la) => la.code === code);
    if (!match) {
      acc.push({ name, code });
    }

    return acc;
  }, [] as Record<string, string>[]);

  logger.info(`Total schools: ${openSchools.length}`);
  logger.info(`Total local authorities: ${localAuthorities.length}`);

  const uri = process?.env?.MONGODB_CONNECTION_STRING ?? 'mongodb://localhost:27017/';
  const mongoClient = new MongoClient(uri); // should do this outside the handler

  try {
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
        }
      ) => {
        const match = currentSchools.find((school) => school.urn === urn);
        logger.info(`${easting} ${northing}`);

        // const [longitude, latitude] = convertEastingNorthingtoLatLng(
        //   Number(easting),
        //   Number(northing)
        // ); // for one record it is not reading it correctly...

        const entry = {
          urn,
          name,
          localAuthority,
          postcode,
          easting,
          northing,
          // latitude,
          // longitude,
        };

        if (!match || !checkIfObjectValuesMatch(Object.keys(entry), match, entry)) {
          acc.push({
            updateOne: {
              filter: { urn },
              update: {
                $set: entry,
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
