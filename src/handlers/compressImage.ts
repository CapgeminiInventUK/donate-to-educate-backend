import { APIGatewayProxyResult } from 'aws-lambda';
import { convertImageToWebpFormat } from '../shared/image';
import { logger } from '../shared/logger';

export const lambdaHandler = async (): Promise<APIGatewayProxyResult> => {
  try {
    await convertImageToWebpFormat('@large-image.jpeg', 200, '2.webp');

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'hello world',
      }),
    };
  } catch (error) {
    logger.error(error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: (error as Error).message,
      }),
    };
  }
};
