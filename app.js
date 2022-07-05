const express = require('express');
const app = express();
<<<<<<< HEAD
const { getReviewById, getCategories, patchReviewById, getUsers, getCommentsByReviewId } = require('./controllers/controller.games');
=======
const { getReviewById, getCategories, patchReviewById, getUsers, getReviews } = require('./controllers/controller.games');
>>>>>>> main
const { handleCustomErrors, handlePSQLErrors, unhandledErrors, noPath } = require('./errors/error-handlers.js');

app.use(express.json());

app.get('/api/categories', getCategories);
app.get('/api/categories', getCategories);
app.get('/api/review/:review_id', getReviewById);
app.get('/api/users', getUsers);
<<<<<<< HEAD
app.get('/api/reviews/:review_id/comments', getCommentsByReviewId);
=======
app.get('/api/reviews', getReviews);
>>>>>>> main

app.patch('/api/reviews/:review_id', patchReviewById);

app.get('*', noPath);

app.use(handleCustomErrors);
app.use(handlePSQLErrors);
app.use(unhandledErrors);

module.exports = app;
