const db = require('../db/connection.js');

exports.fetchCategories = () => {
  return db.query('SELECT * FROM categories').then(({ rows }) => {
    return rows;
  });
};

exports.fetchReviewById = (review_id) => {
  return db.query(`SELECT * FROM reviews WHERE review_id = $1;`, [review_id]).then(({ rows }) => {
    if (rows[0] === undefined) {
      return Promise.reject({ status: 404, msg: 'Review not found' });
    }
    return rows[0];
  });
};
