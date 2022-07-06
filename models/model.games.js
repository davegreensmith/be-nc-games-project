const db = require('../db/connection.js');

exports.fetchCategories = () => {
  return db.query('SELECT * FROM categories').then(({ rows }) => {
    return rows;
  });
};

exports.updateReviewById = (review_id, inc_votes) => {
  return db.query(`UPDATE reviews SET votes = votes + $2 WHERE review_id = $1 RETURNING *;`, [review_id, inc_votes]).then(({ rows, rowCount }) => {
    if (rowCount === 0) {
      return Promise.reject({ status: 404, msg: 'Review not found' });
    }
    return rows[0];
  });
};

exports.fetchReviewById = (review_id) => {
  return db
    .query(
      `SELECT reviews.*, COUNT(comments.comment_id)::INT AS comment_count FROM reviews
  JOIN comments ON reviews.review_id = comments.review_id
  WHERE reviews.review_id=$1
  GROUP BY reviews.review_id;`,
      [review_id]
    )
    .then(({ rows }) => {
      if (rows[0] === undefined) {
        return Promise.reject({ status: 404, msg: 'Review not found' });
      }
      return rows[0];
    });
};

exports.fetchUsers = () => {
  return db.query('SELECT * FROM users').then(({ rows }) => {
    return rows;
  });
};

exports.fetchCommentsByReviewId = (review_id) => {
  return db.query(`SELECT * FROM comments WHERE review_id = $1;`, [review_id]).then(({ rows, rowCount }) => {
    if (rowCount === 0) {
      return Promise.reject({ status: 404, msg: 'Comment not found' });
    }
    return rows;
  });
};

exports.fetchReviews = () => {
  return db
    .query(
      `SELECT reviews.*, count(comments.review_id)::INT AS comment_count FROM reviews
       LEFT JOIN comments ON reviews.review_id=comments.review_id
       GROUP BY reviews.review_id
       ORDER BY reviews.created_at DESC;`
    )
    .then(({ rows }) => {
      return rows;
    });
};
