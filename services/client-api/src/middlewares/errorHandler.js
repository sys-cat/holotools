const logger = require('../utils/logger');

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  const statusCode = 400;

  console.group('Error');
  logger.error(`Request body: ${JSON.stringify(req.body)}`);
  logger.error(err);
  console.groupEnd();

  res.status(statusCode).json({ message: err.message });
};
