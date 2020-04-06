require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');

const logger = require('./utils/logger');
const errorHandler = require('./middlewares/errorHandler');

const SERVER_PORT = process.env.SERVER_PORT || 8080;

const app = express();
app.use(helmet());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ strict: false }));

app.get('/', (req, res) => {
  res.json({ env: process.env.NODE_ENV, time: Date.now() });
});

const routesV1 = require('./routes/v1');

app.use('/v1', routesV1);

app.use(errorHandler);

app.listen(SERVER_PORT, () => {
  logger.log('HOLOTOOLS WEB | :%d | %s', SERVER_PORT, process.env.NODE_ENV);
});
