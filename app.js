const express = require('express');
const app = express();
const { getReviewById, getCategories, patchReviewById, getUsers, getReviews, postCommentByReviewId } = require('./controllers/controller.games');
const { handleCustomErrors, handlePSQLErrors, unhandledErrors, noPath } = require('./errors/error-handlers.js');

app.use(express.json());

app.get('/api/categories', getCategories);
app.get('/api/categories', getCategories);
app.get('/api/review/:review_id', getReviewById);
app.get('/api/users', getUsers);
app.get('/api/reviews', getReviews);

app.patch('/api/reviews/:review_id', patchReviewById);

app.post('/api/reviews/:review_id/comments', postCommentByReviewId);

app.get('*', noPath);

app.use(handleCustomErrors);
app.use(handlePSQLErrors);
app.use(unhandledErrors);

module.exports = app;
