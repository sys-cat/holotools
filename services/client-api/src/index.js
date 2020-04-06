const config = require('config');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');

console.log('SERVER_PORT', process.env.SERVER_PORT);
console.log('NODE_ENV', process.env.NODE_ENV);
console.log('MEMCACHED_CLUSTERIP', process.env.MEMCACHED_CLUSTERIP);
console.log('GOOGLE_API_KEY', process.env.GOOGLE_API_KEY);
console.log('GOOGLE_SERVICE_JSON', process.env.GOOGLE_SERVICE_JSON);

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
