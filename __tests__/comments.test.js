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
        expect(postedComment).toEqual({
          author: 'dav3rid',
          body: "My cats didn't want to know - they just scattered the pieces everywhere",
          comment_id: 7,
          created_at: expect.any(String),
          review_id: 1,
          votes: 0,
        });
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
    test('404: Not found response where username does not exist in users table', () => {
      const postComment = {
        username: 'salehTheGreat',
        body: 'Padme loves the box, the game came in',
      };
      return request(app)
        .post('/api/reviews/1/comments')
        .send(postComment)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Not found');
        });
    });
  });
});
