\c nc_games_test

<<<<<<< HEAD
UPDATE reviews
SET 
    votes = votes + 20
WHERE review_id = 1
RETURNING *;
=======
SELECT * FROM reviews
WHERE review_id = 3;
>>>>>>> main
