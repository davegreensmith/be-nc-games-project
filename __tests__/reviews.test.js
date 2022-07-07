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
  describe('queries', () => {
    test('sort_by: sort the reviews by created_at column', () => {
      return request(app)
        .get('/api/reviews?sort_by=created_at')
        .expect(200)
        .then(({ body: { reviews } }) => {
          expect(reviews).toBeInstanceOf(Array);
          expect(reviews).toHaveLength(13);
          expect(reviews).toBeSortedBy('created_at', { descending: true });
        });
    });
    test('sort_by: sort the reviews by created_at column and ordered ascending', () => {
      return request(app)
        .get('/api/reviews?sort_by=created_at&order=asc')
        .expect(200)
        .then(({ body: { reviews } }) => {
          expect(reviews).toBeInstanceOf(Array);
          expect(reviews).toHaveLength(13);
          expect(reviews).toBeSortedBy('created_at', { descending: false });
        });
    });
    test('sort_by: sort the reviews by created_at column and ordered ascending, filtered by the category', () => {
      return request(app)
        .get('/api/reviews?sort_by=created_at&order=asc&category=dexterity')
        .expect(200)
        .then(({ body: { reviews } }) => {
          expect(reviews).toBeInstanceOf(Array);
          expect(reviews).toHaveLength(1);
          expect(reviews).toBeSortedBy('created_at', { descending: false });
        });
    });
    describe('errors', () => {
      test('400: bad request - message "Invalid query" sort_by is misspelt', () => {
        return request(app)
          .get('/api/reviews?sort_pizza=created_at')
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe('Invalid query');
          });
      });
      test('400: bad request - message "Invalid query" sort_by query does not contain valid parameters', () => {
        return request(app)
          .get('/api/reviews?sort_by=pizza')
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe('Invalid query');
          });
      });
      test('400: bad request - message "Invalid query" order is misspelt', () => {
        return request(app)
          .get('/api/reviews?sort_by=created_at&origin=asc')
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe('Invalid query');
          });
      });
      test('400: bad request - message "Invalid query" order query does not contain valid parameters', () => {
        return request(app)
          .get('/api/reviews?sort_by=created_at&order=pizza')
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe('Invalid query');
          });
      });
      test('400: bad request - message "Invalid query" category is misspelt', () => {
        return request(app)
          .get('/api/reviews?sort_by=created_at&order=asc&dogegory=dexterity')
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe('Invalid query');
          });
      });
      test('400: bad request - message "Invalid query" category query does not contain valid parameters', () => {
        return request(app)
          .get('/api/reviews?sort_by=created_at&order=asc&category=pizza')
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe('Invalid query');
          });
      });
    });
  });
});
