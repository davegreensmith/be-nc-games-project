const db = require('../db/connection.js');

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

exports.fetchReviews = (sort_by = 'created_at', order = 'desc', category, reqQuery) => {
  if (Object.keys(reqQuery).length > 0) {
    const permittedQueries = ['sort_by', 'order', 'category'];

    for (let key in reqQuery) {
      if (!permittedQueries.includes(key)) {
        return Promise.reject({
          status: 400,
          msg: 'Invalid query',
        });
      }
    }
  }

  const validSort_byValues = ['review_id', 'title', 'category', 'designer', 'owner', 'review_body', 'review_img_url', 'created_at', 'votes', 'comment_count'];

  const validSort_byorder = ['asc', 'ASC', 'desc', 'DESC'];

  const validCategoryFilter = ['euro game', 'social deduction', 'dexterity', "children's games"];

  if (!validSort_byValues.includes(sort_by) || !validSort_byorder.includes(order) || (category && !validCategoryFilter.includes(category))) {
    return Promise.reject({ status: 400, msg: 'Invalid query' });
  }

  let queryStr = `
  SELECT reviews.*, count(comments.review_id)::INT AS comment_count FROM reviews
  LEFT JOIN comments ON reviews.review_id=comments.review_id`;

  if (category) {
    queryStr += ` WHERE reviews.category = '${category}' `;
  }

  queryStr += `
  GROUP BY reviews.review_id
  ORDER BY reviews.${sort_by} ${order};`;

  return db.query(queryStr).then(({ rows }) => {
    return rows;
  });
};
