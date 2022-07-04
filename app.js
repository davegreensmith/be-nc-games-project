const express = require('express');
const app = express();
const { getCategories, getReviewById } = require('./controllers/controller.games');
const { handleCustomErrors, handlePSQLErrors, unhandledErrors, noPath } = require('./errors/error-handlers.js');

app.get('/api/categories', getCategories);
app.get('/api/review/:review_id', getReviewById);

app.get('*', noPath);

app.use(handleCustomErrors);
app.use(handlePSQLErrors);
app.use(unhandledErrors);

module.exports = app;
