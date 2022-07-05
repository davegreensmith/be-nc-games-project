const db = require('../db/connection.js');

exports.fetchCategories = () => {
  return db.query('SELECT * FROM categories').then(({ rows }) => {
    return rows;
  });
};

exports.updateReviewById = (review_id, inc_votes) => {
  if (inc_votes === undefined) {
    return Promise.reject({ status: 400, msg: 'Bad request' });
  }

  return db.query(`UPDATE reviews SET votes = votes + $2 WHERE review_id = $1 RETURNING *;`, [review_id, inc_votes]).then(({ rows }) => {
    return rows[0];
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
