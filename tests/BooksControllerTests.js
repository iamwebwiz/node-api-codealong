const should = require('should');
const sinon = require('sinon');
const BooksController = require('../controllers/BooksController');

describe('Books controller tests:', () => {
  describe('Post', () => {
    it('should not allow an empty title on post', () => {
      // Mock a book
      const Book = function (book) {
        this.save = () => {
        };
      };

      const req = { body: { author: 'Ezekiel' } };

      const res = {
        status: sinon.spy(),
        send: sinon.spy(),
        json: sinon.spy(),
      };

      const controller = BooksController(Book);
      controller.post(req, res);

      res.status.calledWith(400)
        .should
        .equal(true, `Bad Status ${res.status.args[0][0]}`);
      res.send.calledWith('Title is required')
        .should
        .equal(true);
    });
  });
});
