
const request = require('supertest');
const app = require('../app'); 
const db = require('../models');

describe('User Routes', () => {
    beforeAll(async () => {
      // Connect to the test database or set up the test environment
      await db.sequelize.sync();
    });
  
    afterAll(async () => {
      // Close the database connection or clean up the test environment
      await db.sequelize.close();
    });
  
    beforeEach(async () => {
      // Optionally, you can add test data setup before each test case
      // For example, create some test users in the database
      await db.User.create({ name: 'John Doe', email: 'john@example.com' });
      await db.User.create({ name: 'Jane Smith', email: 'jane@example.com' });
    });
  
    afterEach(async () => {
      // Optionally, you can clean up the test data after each test case
      await db.User.destroy({ where: {} });
    });
  
    it('should return a user model', async () => {
        const response = await request(app)
            .get('/api/user')
            .send({ email: 'jane@example.com' });;
        expect(response.status).toBe(200);
      // Add more assertions as needed
    });
  
    it('should create a new user', async () => {
      const response = await request(app)
        .post('/api/user')
        .send({ name: 'Test User', email: 'test@example.com' });
      expect(response.status).toBe(201);
      // Add more assertions to check the response or the saved user in the database
    });
  
    // Add more test cases for other user routes (e.g., update, delete)
  
  });