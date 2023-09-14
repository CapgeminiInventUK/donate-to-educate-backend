export const checkIfObjectValuesMatch = (
    keys: string[],
    firstObject: Record<string, string>,
    secondObject: Record<string, string>,
) => {
    return keys.every((key) => firstObject[key] === secondObject[key]);
};
