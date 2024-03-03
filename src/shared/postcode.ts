import axios from 'axios';

export const convertPostcodeToLatLng = async (postcode: string): Promise<[number, number]> => {
  const { data } = await axios.get<{ result: { longitude: number; latitude: number } }>(
    `api.postcodes.io/postcodes/${postcode}`
  );
  const { longitude, latitude } = data.result;
  return [longitude, latitude];
};
