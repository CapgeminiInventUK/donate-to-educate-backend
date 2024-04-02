module.exports = async function () {
  await globalThis.__MONGOD__.stop();
};
