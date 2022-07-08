const app = require('../app');
const request = require('supertest');

describe('GET /api/', () => {
  test('200: response with json body from endpoints.json file', () => {
    return request(app)
      .get('/api/')
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(typeof endpoints).toBe('object');
      });
  });
});
