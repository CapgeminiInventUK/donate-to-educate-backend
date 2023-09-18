import sharp from 'sharp';

// !Important sharp is not working when built for some reason
// Example code for the AWS Lambdas to reduce uploaded image size
// This reduced the size 6.6MB => 13KB which is a huge saving
//convertImageToWebpFormat('large-image.jpeg', 300, 'test.webp');
export const convertImageToWebpFormat = async (
  fileName: string,
  width: number,
  outputFileName: string
): Promise<void> => {
  await sharp(fileName).resize(width).webp().toFile(outputFileName);
};
