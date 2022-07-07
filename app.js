const express = require('express');
const app = express();

const { getCategories } = require('./controllers/controller.categories');
const { getCommentsByReviewId, postCommentByReviewId, deleteCommentByCommentId } = require('./controllers/controller.comments');
const { getReviewById, patchReviewById, getReviews } = require('./controllers/controller.reviews');
const { getUsers } = require('./controllers/controller.users');

const { handleCustomErrors, handlePSQLErrors, unhandledErrors, noPath } = require('./errors/error-handlers.js');

app.use(express.json());

app.get('/api/categories', getCategories);
app.get('/api/review/:review_id', getReviewById);
app.get('/api/users', getUsers);
app.get('/api/reviews/:review_id/comments', getCommentsByReviewId);
app.get('/api/reviews', getReviews);

app.patch('/api/reviews/:review_id', patchReviewById);

app.post('/api/reviews/:review_id/comments', postCommentByReviewId);

app.delete('/api/comments/:comment_id', deleteCommentByCommentId);

app.get('*', noPath);

app.use(handleCustomErrors);
app.use(handlePSQLErrors);
app.use(unhandledErrors);

module.exports = app;
