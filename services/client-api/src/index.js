require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');

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

const routes1 = require('./routes/v1');

app.use('/v1', routes1);

app.use(errorHandler);

app.listen(SERVER_PORT, () => {
  console.log('HOLOTOOLS WEB | :%d | %s | %s', SERVER_PORT, process.env.NODE_ENV, new Date().toString());
});
