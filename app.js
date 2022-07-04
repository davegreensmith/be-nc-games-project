const express = require('express');
const app = express();
const { getCategories, patchReviewById, noPath } = require('./controllers/controller.games');

app.use(express.json());

app.get('/api/categories', getCategories);

app.patch('/api/reviews/:review_id', patchReviewById);

app.get('*', noPath);

module.exports = app;
