const config = require('config');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');

const SERVER_PORT = process.env.SERVER_PORT || config.server.port || 8080;

const app = express();
app.use(helmet({}));
app.use(cors({}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json({strict: false}));

app.get('/', (req, res) => {
  res.status(200).json({env: config.env, time: Date.now()});
});

const routes1 = require('./routes/v1');

app.use('/v1', routes1);

app.listen(SERVER_PORT, () => {
  console.log('HOLOTOOLS WEB | :%d | %s | %s', SERVER_PORT, config.env, new Date().toString());
});
