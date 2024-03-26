module.exports = {
  mongodbMemoryServerOptions: {
    binary: {
      skipMD5: true,
    },
    autoStart: true,
    instance: { dbName: 'D2E' },
    replSet: {
      count: 3,
      storageEngine: 'wiredTiger',
    },
  },
  useSharedDBForAllJestWorkers: false,
};
