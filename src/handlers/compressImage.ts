import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { convertImageToWebpFormat } from '../shared/image';

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        convertImageToWebpFormat('@large-image.jpeg', 200, '2.webp');

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'hello world',
            }),
        };
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: (err as Error).message,
            }),
        };
    }
};
