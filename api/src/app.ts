const express = require('express');
const cors = require('cors');
const compression = require('compression');

const app = express();
app.use(compression());
app.use(express.json());
app.use(cors());
app.use(router);

module.exports = app;
