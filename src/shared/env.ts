export const isTest = (): boolean => {
  return process?.env?.JEST_WORKER_ID !== undefined || process?.env?.NODE_ENV === 'test';
};

export const isLocal = (): boolean => {
  return process?.env?.NODE_ENV === 'local';
};
