require('should');

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Book = mongoose.model('Book');
const agent = request.agent(app);

describe('Book CRUD Test', () => {
  it('should allow a book to be posted and return read and _id', (done) => {
    const bookData = {
      title: 'Test Book',
      author: 'Test Author',
      genre: 'Fiction',
    };

    agent.post('/api/books')
      .send(bookData)
      .expect(201)
      .end((err, results) => {
        results.body.read.should.not.equal('false');
        results.body.should.have.property('_id');
        done();
      });
  });
});
