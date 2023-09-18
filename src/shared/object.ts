export const checkIfObjectValuesMatch = (
  keys: string[],
  firstObject: Record<string, string | number>,
  secondObject: Record<string, string | number>
): boolean => {
  return keys.every((key) => firstObject[key] === secondObject[key]);
};
