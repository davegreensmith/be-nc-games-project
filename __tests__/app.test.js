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
  test('get /api/review/:review_id 200 code responds with an object, which has the properties of the requested review', () => {
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
