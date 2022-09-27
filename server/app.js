const express = require('express');
const path = require('path');
const routes = require('routes.js');

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, '../build')));

app.use(routes);

module.exports = app;
