const createClient = require('weliterpcjs').createClient;

const client = createClient(process.env.API_URL || 'https://node1.weyoume.io', {timeout: 15000});
client.sendAsync = (message, params) =>
  new Promise((resolve, reject) => {
    client.send(message, params, (err, result) => {
      if (err !== null) return reject(err);
      console.log('Connection weliterpcjs');
      return resolve(result);
    });
  });

// const Client = require('weliterpcjs');
const bluebird = require('bluebird');
// const client = new Client('https://node.weyoume.io');
bluebird.promisifyAll(client);

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const getBlock = blockNum => client.sendAsync('get_block',[blockNum]).catch(err=>{console.error('err', err)});

const getOpsInBlock = (blockNum, onlyVirtual = false) =>
  client.sendAsync('get_ops_in_block', [blockNum, onlyVirtual]).catch(err=>{console.error('err', err)});;

const getGlobalProps = () =>
  client.sendAsync('get_dynamic_global_properties', []).catch(err=>{console.error('err', err)});;

const multiOpsInBlock = (start, limit, onlyVirtual = false) => {
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
  multiOpsInBlock,
  getBlockOps,
  client
};
