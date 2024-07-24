export const checkIfObjectValuesMatch = (
  keys: string[],
  firstObject: Record<string, string | number>,
  secondObject: Record<string, string | number>
): boolean => {
  return keys.every((key) => firstObject[key] === secondObject[key]);
};

export const removePropertiesFromObject = (
  keysToDelete: string[],
  object: Record<string, unknown>
): Record<string, unknown> => {
  keysToDelete.forEach((item) => {
    if (item in object) {
      delete object[item];
    }
  });
  return object;
};

export const castToObjectWithBody = (object: unknown) => {
  return object as { body: string };
};
