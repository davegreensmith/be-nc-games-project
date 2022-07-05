\c nc_games_test

UPDATE reviews SET votes = votes + 20 WHERE review_id = 69 RETURNING *;
