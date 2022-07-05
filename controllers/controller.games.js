const categories = require('../db/data/test-data/categories');
const { fetchCategories, fetchReviewById, updateReviewById } = require('../models/model.games.js');

exports.getCategories = (req, res, next) => {
  fetchCategories().then((categories) => {
    res.status(200).send({ categories });
  });
};

exports.patchReviewById = (req, res, next) => {
  const { review_id } = req.params;
  const { inc_votes } = req.body;
  updateReviewById(review_id, inc_votes).then((review) => {
    // console.log(review, '<<< review passed back from promise');
    for (let key in review) {
      console.log('key >>>', review[key], 'type >>>', typeof review[key]);
    }
    res.status(201).send({ review });
  });
};

exports.noPath = (req, res) => {
  res.status(404).send({ msg: 'Path not found' });
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
