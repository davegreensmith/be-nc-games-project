const express = require('express');
const app = express();
const { getCategories, noPath } = require('./controllers/controller.games');

app.get('/api/categories', getCategories);
app.get('*', noPath);

module.exports = app;
