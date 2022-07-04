const categories = require('../db/data/test-data/categories');
const { fetchCategories } = require('../models/model.games.js');

exports.getCategories = (req, res, next) => {
  fetchCategories().then((categories) => {
    res.status(200).send({ categories });
  });
};

exports.noPath = (req, res) => {
  res.status(404).send({ msg: 'Path not found' });
};
