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
    test('patch /api/reviews/pizza responds with 400 code and returns message ""', () => {});
  });
});
