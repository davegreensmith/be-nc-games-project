\c nc_games_test

SELECT reviews.*, COUNT(comments.comment_id) AS comment_count FROM reviews
JOIN comments ON reviews.review_id = comments.review_id
WHERE reviews.review_id=3
GROUP BY reviews.review_id;

