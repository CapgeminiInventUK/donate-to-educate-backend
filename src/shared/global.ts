export const splitAtLastHyphen = (str: string): string => {
  const lastHyphenIndex = str.lastIndexOf('-');
  if (lastHyphenIndex === -1) {
    return str.trim();
  }
  return str.substring(0, lastHyphenIndex).trim();
};
