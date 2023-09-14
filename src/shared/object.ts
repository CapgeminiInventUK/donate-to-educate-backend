export const checkIfObjectValuesMatch = (
  keys: string[],
  firstObject: Record<string, string>,
  secondObject: Record<string, string>
): boolean => {
  return keys.every((key) => firstObject[key] === secondObject[key]);
};
