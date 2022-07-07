const db = require('../db/connection.js');

exports.fetchCommentsByReviewId = (review_id) => {
  return Promise.all([db.query(`SELECT * FROM comments WHERE review_id = $1;`, [review_id]), this.checkReviewIdExists(review_id)]).then(([{ rows }]) => {
    return rows;
  });
};

exports.checkReviewIdExists = (review_id) => {
  const queryStr = `SELECT * FROM reviews WHERE review_id = $1`;

  if (!review_id) return;
  return db.query(queryStr, [review_id]).then(({ rowCount }) => {
    if (rowCount === 0) {
      return Promise.reject({ status: 404, msg: 'Review not found' });
    } else return true;
  });
};

exports.addCommentByReviewId = (review_id, username, body) => {
  return Promise.all([
    db.query(`INSERT INTO comments (body, review_id, author, votes, created_at) VALUES ($3, $1, $2, 0, now()::timestamp) RETURNING *;`, [review_id, username, body]),
    this.checkUserExists(username),
  ]).then((data) => {
    const rows = data[0].rows;
    return rows[0];
  });
};

exports.checkUserExists = (username) => {
  const queryStr = `SELECT * FROM users WHERE username = $1`;
  if (!username) return;
  return db.query(queryStr, [username]).then(({ rowCount }) => {
    if (rowCount === 0) {
      return Promise.reject({ status: 404, msg: 'User not found' });
    } else return true;
  });
};

exports.removeCommentByCommentId = (comment_id) => {
  return Promise.all([db.query('SELECT * FROM comments WHERE comment_id=$1', [comment_id]), comment_id]).then(([{ rows }, comment_id]) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: 'Comment not found' });
    }
    return db.query('DELETE FROM comments WHERE comment_id = $1', [comment_id]);
  });
};
