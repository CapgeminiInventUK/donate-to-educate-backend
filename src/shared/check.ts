export const checkIfDefinedElseDefault = (value?: string | null, defaultValue = ''): string => {
  return value ?? defaultValue;
};
