const { fetchCategories } = require('../models/models.categories.js');

exports.getCategories = (req, res, next) => {
  fetchCategories().then((categories) => {
    res.status(200).send({ categories });
  });
};
