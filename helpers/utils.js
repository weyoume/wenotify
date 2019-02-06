const createClient = require('weliterpcjs').createClient;

const client = createClient(process.env.API_URL || 'https://node.weyoume.io', {timeout: 15000});
client.send = (message, params) =>
  new Promise((resolve, reject) => {
    client.send(message, params, (err, result) => {
      if (err !== null) return reject(err);
      return resolve(result);
    });
  });

// const Client = require('weliterpcjs');
const bluebird = require('bluebird');
// const client = new Client('https://node.weyoume.io');
bluebird.promisifyAll(client);

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const getBlock = blockNum => client.sendAsync({ method: 'get_block', params: [blockNum] }, null);

const getOpsInBlock = (blockNum, onlyVirtual = false) =>
  client.sendAsync({ method: 'get_ops_in_block', params: [blockNum, onlyVirtual] }, null);

const getGlobalProps = () =>
  client.sendAsync({ method: 'get_dynamic_global_properties', params: [] }, null);

const mutliOpsInBlock = (start, limit, onlyVirtual = false) => {
  const request = [];
  for (let i = start; i < start + limit; i++) {
    request.push({ method: 'get_ops_in_block', params: [i, onlyVirtual] });
  }
  return client.sendBatchAsync(request, { timeout: 20000 });
};

const getBlockOps = block => {
  const operations = [];
  block.transactions.forEach(transaction => {
    operations.push(...transaction.operations);
  });
  return operations;
};

module.exports = {
  sleep,
  getBlock,
  getOpsInBlock,
  getGlobalProps,
  mutliOpsInBlock,
  getBlockOps,
  client
};
