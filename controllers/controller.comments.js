const { fetchCommentsByReviewId, addCommentByReviewId, removeCommentByCommentId } = require('../models/models.comments.js');

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

exports.deleteCommentByCommentId = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentByCommentId(comment_id).then(() => {
    res.status(204).send();
  });
};
