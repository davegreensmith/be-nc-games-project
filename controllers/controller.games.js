const categories = require('../db/data/test-data/categories');

const { fetchCategories, fetchReviewById, updateReviewById, fetchUsers, fetchCommentsByReviewId, fetchReviews, addCommentByReviewId } = require('../models/model.games.js');

exports.getCategories = (req, res, next) => {
  fetchCategories().then((categories) => {
    res.status(200).send({ categories });
  });
};

exports.patchReviewById = (req, res, next) => {
  const { review_id } = req.params;
  const { inc_votes } = req.body;

  updateReviewById(review_id, inc_votes)
    .then((review) => {
      res.status(201).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviewById = (req, res, next) => {
  const { review_id } = req.params;

  fetchReviewById(review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUsers = (req, res) => {
  fetchUsers().then((users) => {
    res.status(200).send({ users });
  });
};

exports.getCommentsByReviewId = (req, res, next) => {
  const { review_id } = req.params;
  fetchCommentsByReviewId(review_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviews = (req, res) => {
  fetchReviews().then((reviews) => {
    res.status(200).send({ reviews });
  });
};

exports.postCommentByReviewId = (req, res, next) => {
  const { review_id } = req.params;
  const { username, body } = req.body;
  addCommentByReviewId(review_id, username, body)
    .then((postedComment) => {
      res.status(201).send({ postedComment });
    })
    .catch((err) => {
      // console.log(err);
      next(err);
    });
};
