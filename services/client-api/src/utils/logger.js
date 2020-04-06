const ENV = process.env.NODE_ENV;
const formatMessage = (message) => (ENV === 'production'
  ? message : `${new Date().toUTCString()} | ${message}`);

/* eslint-disable no-console */
module.exports = {
  log(message, ...args) {
    console.log(formatMessage(message), ...args);
  },
  warn(message, ...args) {
    console.warn(formatMessage(message), ...args);
  },
  error(message, ...args) {
    console.error(formatMessage(message), ...args);
  },
};
