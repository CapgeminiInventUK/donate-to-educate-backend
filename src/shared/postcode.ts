import axios from 'axios';

export const convertPostcodeToLatLng = async (postcode: string): Promise<[number, number]> => {
  const { data } = await axios.get<{ result: { longitude: number; latitude: number } }>(
    `https://api.postcodes.io/postcodes/${postcode}`
  );
  const { longitude, latitude } = data.result;
  return [longitude, latitude];
};

export const convertPostcodeToLatLngWithDefault = async (
  postcode: string | null | undefined
): Promise<[number, number]> => {
  try {
    return postcode ? await convertPostcodeToLatLng(postcode.replace(/\s/g, '')) : [0, 0];
  } catch {
    return [0, 0];
  }
};
