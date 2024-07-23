import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { type Request, type Response, type Application } from 'express';
import pino from 'pino';

const logger = pino();
const app: Application = express();
dotenv.config();

app.use(cors());
app.use(express.json());

// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.post('/graphql', async (req: Request, res: Response) => {
  const { variables, query } = req.body;
  const fieldName = getFieldName(query);

  logger.info(`Called with: { fieldName: ${fieldName}, variables: ${JSON.stringify(variables)}}`);
  try {
    const { data } = await axios.post(
      getUrl('getSchool'),
      JSON.stringify({
        arguments: variables,
        source: {},
        request: {
          headers: {},
          domainName: null,
        },
        info: {
          selectionSetList: [],
          selectionSetGraphQL: '',
          parentTypeName: '',
          fieldName,
          variables: {},
        },
        prev: null,
        stash: {},
      }),
      {
        headers: {
          'X-Amz-Invocation-Type': 'Event',
          'Content-Type': 'application/json',
        },
      }
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    return res.status(200).json({ data: { [fieldName]: data } });
  } catch (error) {
    res.status(500).json({ message: JSON.stringify(error) });
  }
});

const port = process.env.PORT ?? 3000;
app.listen(port, () => undefined);

const getUrl = (fieldName: string): string => {
  return (
    (fieldName.includes('get') || fieldName.includes('has')
      ? process.env.PUBLIC_RESOLVER_URL
      : process.env.PRIVATE_RESOLVER_URL) ?? ''
  );
};

const getFieldName = (query: string): string => {
  return query.split('{')[1].split('(')[0].trim();
};
