const db = require('../db/connection.js');

exports.fetchCategories = () => {
  return db.query('SELECT * FROM categories').then(({ rows }) => {
    return rows;
  });
};

exports.updateReviewById = (review_id, inc_votes) => {
  return db.query(`UPDATE reviews SET votes = votes + $2 WHERE review_id = $1 RETURNING *;`, [review_id, inc_votes]).then(({ rows }) => {
    return rows[0];
  });
};
