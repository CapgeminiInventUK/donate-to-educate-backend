import proj4 from 'proj4';

const osgb =
  '+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 +units=m +no_defs ';
const wgs84 = '+proj=longlat +datum=WGS84 +no_defs ';

export const convertEastingNorthingtoLatLng = (
  easting: number,
  northing: number
): [number, number] => {
  if (isNaN(easting) || isNaN(northing)) {
    return [0, 0];
  }

  return proj4(osgb, wgs84, [easting, northing]);
};
