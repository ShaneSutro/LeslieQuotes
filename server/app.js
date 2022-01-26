const express = require('express');
const app = express();
const dotenv = require('dotenv');
const path = require('path');
const morgan = require('morgan');
const helmet = require('helmet');
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}
const auth = require('./middleware/auth');

const router = require('./api/v1');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet());
app.use(morgan('tiny'));
app.use(express.static(path.resolve(__dirname, '../build')));

app.use('/api/v1', router);

app.get('/test', auth, (req, res) => {
  console.log(req.currentUser);
  res.sendStatus(200);
});

app.post('/login', (req, res) => {
  console.log(req.body);
});

module.exports = app;
