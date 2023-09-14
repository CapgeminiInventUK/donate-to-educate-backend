import { readdirSync, rmSync, unlinkSync } from 'fs';
import csv from 'csvtojson';
import { AnyBulkWriteOperation, MongoClient } from 'mongodb';
import { unzip } from '../shared/zip';
import { downloadSchoolDataFileLocally } from '../shared/puppeteer';

export const lambdaHandler = async (): Promise<{ statusCode: number }> => {
    await downloadSchoolDataFileLocally();

    try {
        await unzip('extract.zip', './extracted');

        const filename = readdirSync('./extracted').pop();

        const data = (await csv().fromFile(`extracted/${filename}`)) as Record<string, string>[];
        const openSchools = data.filter(
            ({ 'EstablishmentStatus (name)': status, 'TypeOfEstablishment (name)': type }) =>
                status === 'Open' && !type.includes('independent'),
        );

        const localAuthorities = data.reduce((acc, { 'LA (name)': name, 'LA (code)': code }) => {
            const match = acc.find((la) => la.code === code);
            if (!match) {
                acc.push({ name, code });
            }

            return acc;
        }, <Record<string, string>[]>[]);

        console.log(`Total schools: ${openSchools.length}, Total local authorities: ${localAuthorities.length}`);

        const uri = 'mongodb://localhost:27017/';
        const mongoClient = new MongoClient(uri);

        try {
            const database = mongoClient.db('D2E');
            const schoolCollection = database.collection('SchoolData');

            const currentSchools = await schoolCollection.find().toArray();

            const schoolUpdateOperations = openSchools.reduce(
                (acc, { URN: urn, EstablishmentName: name, 'LA (name)': localAuthority }) => {
                    const match = currentSchools.find((school) => school.urn === urn);

                    if (
                        !match ||
                        !(match?.urn === urn && match?.name === name && match?.localAuthority === localAuthority)
                    ) {
                        acc.push({
                            updateOne: {
                                filter: { urn },
                                update: { $set: { urn, name, localAuthority }, $setOnInsert: { registered: false } },
                                upsert: true,
                            },
                        });
                    }

                    return acc;
                },
                <AnyBulkWriteOperation[]>[],
            );

            console.log(`${schoolUpdateOperations.length} School update operations`);

            if (schoolUpdateOperations.length > 0) {
                await schoolCollection.bulkWrite(schoolUpdateOperations, {
                    ordered: false,
                });
            }

            const localAuthorityCollection = database.collection('LocalAuthorityData');
            const currentLocalAuthorities = await localAuthorityCollection.find().toArray();
            const localAuthorityUpdateOperations = localAuthorities.reduce((acc, { name, code }) => {
                const match = currentLocalAuthorities.find((la) => la.code === code);

                if (!match || !(match?.name === name && match?.code === code)) {
                    acc.push({
                        updateOne: {
                            filter: { code },
                            update: { $set: { name, code }, $setOnInsert: { registered: false } },
                            upsert: true,
                        },
                    });
                }

                return acc;
            }, <AnyBulkWriteOperation[]>[]);

            console.log(`${localAuthorityUpdateOperations.length} Local Authority update operations`);
            if (localAuthorityUpdateOperations.length > 0) {
                await localAuthorityCollection.bulkWrite(localAuthorityUpdateOperations, {
                    ordered: false,
                });
            }
        } catch (error) {
            console.log(error);
        } finally {
            await mongoClient.close();
        }
    } catch (error) {
        console.log(error);
    } finally {
        unlinkSync('extract.zip');
        rmSync('extracted', { recursive: true, force: true });
    }

    return {
        statusCode: 200,
    };
};
