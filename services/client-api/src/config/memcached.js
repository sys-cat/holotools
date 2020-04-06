const Memcached = require('memcached');
const { promisify } = require('util');

const memcached = new Memcached(`${process.env.MEMCACHED_CLUSTERIP}:11211`);

const memcachedGet = promisify(memcached.get).bind(memcached);
const memcachedSet = promisify(memcached.set).bind(memcached);

module.exports = {
  get: memcachedGet,
  set: memcachedSet,
};
