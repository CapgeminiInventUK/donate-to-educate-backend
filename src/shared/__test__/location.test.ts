import { describe, expect, it } from '@jest/globals';
import { convertEastingNorthingtoLatLng } from '../location';
// invalid returns [0,0]
// otherwise converts to latlon
describe('Location', () => {
  it('check invalid easting and northing is handled', () => {
    const data = convertEastingNorthingtoLatLng(
      null as unknown as number,
      null as unknown as number
    );

    expect(data).toEqual([0, 0]);
  });

  it('check invalid easting is handled', () => {
    const data = convertEastingNorthingtoLatLng(undefined as unknown as number, 53000);

    expect(data).toEqual([0, 0]);
  });

  it('check invalid northing is handled', () => {
    const data = convertEastingNorthingtoLatLng(10000, undefined as unknown as number);

    expect(data).toEqual([0, 0]);
  });

  it('check easting and northing is converted to latlon', () => {
    const data = convertEastingNorthingtoLatLng(628683, 234550);

    expect(data).toEqual([1.3272688503013361, 51.962367479344906]);
  });
});
