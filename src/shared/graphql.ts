export const removeFields = <T extends object>(selectionSetList: string[], obj: T): T => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (selectionSetList.includes(key)) {
      acc = { ...acc, [key]: value as string };
    }
    return acc;
  }, {} as T);
};
