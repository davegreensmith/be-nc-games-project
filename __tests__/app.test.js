const app = require('../app');
const request = require('supertest');
const db = require('../db/connection.js');
const testData = require('../db/data/test-data');
const seed = require('../db/seeds/seed');

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  db.end();
});

describe('GET/api/categories', () => {
  test('GET /api/categories 200 code responds with an array with a length of 4', () => {
    return request(app)
      .get('/api/categories')
      .expect(200)
      .then(({ body: { categories } }) => {
        expect(categories).toBeInstanceOf(Array);
        expect(categories).toHaveLength(4);
      });
  });
  test('GET /api/categories 200 code responds with an array of category object, each should have the properties slug and description', () => {
    return request(app)
      .get('/api/categories')
      .expect(200)
      .then(({ body: { categories } }) => {
        categories.forEach((category) => {
          expect(category).toEqual({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
  describe('errors', () => {
    test("GET /api/categoriez 404 code responds with msg 'Path not found' when the enpoint is spelt incorrectly", () => {
      return request(app)
        .get('/api/categoriez')
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Path not found');
        });
    });
  });
});

describe('GET review by id', () => {
  test('get /api/review/:review_id 200 code responds with an object, which has the properties of the requested review with a comment_count', () => {
    return request(app)
      .get('/api/review/3')
      .expect(200)
      .then(({ body: { review } }) => {
        expect(review).toEqual({
          review_id: 3,
          title: expect.any(String),
          category: expect.any(String),
          review_body: expect.any(String),
          designer: expect.any(String),
          review_img_url: expect.any(String),
          votes: expect.any(Number),
          created_at: expect.any(String),
          owner: expect.any(String),
          comment_count: 3,
        });
      });
  });

  describe('errors', () => {
    test('get /api/review/pizza - bad request - 400 code responds with a message "Bad request"', () => {
      return request(app)
        .get('/api/review/pizza')
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Bad request');
        });
    });
    test('get /api/review/69 - id does not exist - 404 code responds with a message "Review not found"', () => {
      return request(app)
        .get('/api/review/69')
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Review not found');
        });
    });
  });
});

describe('PATCH /api/reviews/:review_id', () => {
  test('patch /api/reviews/1 responds with 201 code and returns the updated review in the message body as an object when votes is udated using a positive number', () => {
    const update = { inc_votes: 20 };
    return request(app)
      .patch('/api/reviews/1')
      .send(update)
      .expect(201)
      .then(({ body: { review } }) => {
        expect(review).toEqual({
          review_id: 1,
          title: 'Agricola',
          category: 'euro game',
          designer: 'Uwe Rosenberg',
          owner: 'mallionaire',
          review_body: 'Farmyard fun!',
          review_img_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
          created_at: expect.any(String),
          votes: 21,
        });
      });
  });

  test('patch /api/reviews/1 responds with 201 code and returns the updated review in the message body as an object when votes is udated using a negative number', () => {
    const update = { inc_votes: -1 };
    return request(app)
      .patch('/api/reviews/1')
      .send(update)
      .expect(201)
      .then(({ body: { review } }) => {
        expect(review).toEqual({
          review_id: 1,
          title: 'Agricola',
          category: 'euro game',
          designer: 'Uwe Rosenberg',
          owner: 'mallionaire',
          review_body: 'Farmyard fun!',
          review_img_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
          created_at: expect.any(String),
          votes: 0,
        });
      });
  });
  describe('errors', () => {
    test('patch /api/reviews/pizza responds with 400 code and returns message ""', () => {
      const update = { inc_votes: 20 };
      return request(app)
        .patch('/api/reviews/pizza')
        .send(update)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Bad request');
        });
    });
    test("patch /api/reviews/69 responds with 404 code and returns message 'Review not found'", () => {
      const update = { inc_votes: 20 };
      return request(app)
        .patch('/api/reviews/69')
        .send(update)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Review not found');
        });
    });
    test("patch /api/reviews/1 and inc_votes is the wrong data type - responds with 400 code and message 'Bad request'", () => {
      const update = { inc_votes: 'pizza' };
      return request(app)
        .patch('/api/reviews/1')
        .send(update)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Bad request');
        });
    });
    test("patch /api/reviews/1 and inc_votes is mis-spelt - responds with 400 code and message 'Bad request'", () => {
      const update = { inc_pizza: 20 };
      return request(app)
        .patch('/api/reviews/1')
        .send(update)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Bad request');
        });
    });
    test("patch /api/reviews/1 and inc_votes is omitted - responds with 400 code and message 'Bad request'", () => {
      const update = {};
      return request(app)
        .patch('/api/reviews/1')
        .send(update)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Bad request');
        });
    });
  });
});

describe('GET /api/users', () => {
  test('200: responds with an array of length 4', () => {
    return request(app)
      .get('/api/users')
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users).toHaveLength(4);
        expect(users).toBeInstanceOf(Array);
      });
  });
  test('200: responds with an array of objects, each object will have the users details', () => {
    return request(app)
      .get('/api/users')
      .expect(200)
      .then(({ body: { users } }) => {
        users.forEach((user) => {
          expect(user).toEqual({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
  describe('errors', () => {
    test('404 responds with "Path not found" when users is misspelt (userz)', () => {
      return request(app)
        .get('/api/userz')
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Path not found');
        });
    });
  });
});

describe('GET /api/reviews', () => {
  test('200: responds with a reviews array of length 13', () => {
    return request(app)
      .get('/api/reviews')
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews).toBeInstanceOf(Array);
        expect(reviews).toHaveLength(13);
      });
  });
  test('200: responds with a reviews array of objects containing the properties from the reviews database table with the addition of a comment_count from the comments table', () => {
    return request(app)
      .get('/api/reviews')
      .expect(200)
      .then(({ body: { reviews } }) => {
        reviews.forEach((review) => {
          expect(review).toEqual({
            owner: expect.any(String),
            title: expect.any(String),
            review_id: expect.any(Number),
            category: expect.any(String),
            review_img_url: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            review_body: expect.any(String),
            designer: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });
  test('200: the array should be in date order, descending', () => {
    return request(app)
      .get('/api/reviews')
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews).toBeSortedBy('created_at', { descending: true });
      });
  });
  describe('errors', () => {
    test('404: responds with "Path not found" when the path is entered incorrectly by the client', () => {
      return request(app)
        .get('/api/remooz')
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Path not found');
        });
    });
  });
});

describe('GET /api/reviews/:review_id/comments', () => {
  test('200: responds with an array of length 3', () => {
    return request(app)
      .get('/api/reviews/2/comments')
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toBeInstanceOf(Array);
        expect(comments).toHaveLength(3);
      });
  });
  test('200: responds with an array of objects with properties from the comments table', () => {
    return request(app)
      .get('/api/reviews/2/comments')
      .expect(200)
      .then(({ body: { comments } }) => {
        comments.forEach((comment) => {
          expect(comment).toEqual({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            review_id: 2,
          });
        });
      });
  });
  test('200: responds with an empty array if the review_id exists but there are no comments', () => {
    return request(app)
      .get('/api/reviews/1/comments')
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toBeInstanceOf(Array);
        expect(comments).toHaveLength(0);
      });
  });
  describe('errors', () => {
    test('400: responds with bad request when :review_id is in the wrong format (String instead of Number)', () => {
      return request(app)
        .get('/api/reviews/pizza/comments')
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Bad request');
        });
    });
    test('404: responds with "Review not found" when there is no review_id which matches the api path entered', () => {
      return request(app)
        .get('/api/reviews/69/comments')
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Review not found');
        });
    });
    test('400: responds with bad request when the api path is misspelt', () => {
      return request(app)
        .get('/api/reviews/2/commentios')
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Path not found');
        });
    });
  });
});

describe('POST /api/reviews/:review_id/comments', () => {
  test('201: responds with the posted comment', () => {
    const postComment = {
      username: 'dav3rid',
      body: "My cats didn't want to know - they just scattered the pieces everywhere",
    };
    return request(app)
      .post('/api/reviews/1/comments')
      .send(postComment)
      .expect(201)
      .then(({ body: { postedComment } }) => {
        expect(postedComment).toBe("My cats didn't want to know - they just scattered the pieces everywhere");
      });
  });
  describe('errors', () => {
    test('400: Bad Request response where :review_id is an invalid type', () => {
      const postComment = {
        username: 'dav3rid',
        body: "My cats didn't want to know - they just scattered the pieces everywhere",
      };
      return request(app)
        .post('/api/reviews/pizza/comments')
        .send(postComment)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Bad request');
        });
    });
    test('404: Not found response where :review_id does not exist (but is valid type)', () => {
      const postComment = {
        username: 'dav3rid',
        body: "My cats didn't want to know - they just scattered the pieces everywhere",
      };
      return request(app)
        .post('/api/reviews/69/comments')
        .send(postComment)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Not found');
        });
    });
    test('400: Bad request response where request body is missing information', () => {
      const postComment = {
        body: "My cats didn't want to know - they just scattered the pieces everywhere",
      };
      return request(app)
        .post('/api/reviews/1/comments')
        .send(postComment)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Bad request');
        });
    });
    test('400: Bad request response where request body is omitted', () => {
      const postComment = {};
      return request(app)
        .post('/api/reviews/1/comments')
        .send()
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Bad request');
        });
    });
    test('400: Bad request response where username does not exist in users table', () => {
      const postComment = {
        username: 'salehTheGreat',
        body: 'Padme loves the box it came in',
      };
      return request(app)
        .post('/api/reviews/pizza/comments')
        .send(postComment)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Bad request');
        });
    });
  });
});
