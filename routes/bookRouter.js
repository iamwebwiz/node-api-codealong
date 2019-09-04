/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable arrow-parens */
const express = require('express');
const BooksController = require('../controllers/BooksController');

const bookRouter = express.Router();

const routes = Book => {
  const controller = BooksController(Book);

  bookRouter.route('/books').get(controller.get);

  // book router middleware
  bookRouter.use('/books/:bookId', (req, res, next) => {
    Book.findById(req.params.bookId, (err, book) => {
      if (err) return res.send(err);
      if (book) {
        req.book = book;
        return next();
      }
      return res.sendStatus(404);
    });
  });

  bookRouter
    .route('/books/:bookId')
    .get((req, res) => {
      const returnBook = req.book.toJSON();
      returnBook.links = {};
      const author = req.book.author.replace(' ', '%20');
      returnBook.links.FilterByThisAuthor = `http://${req.headers.host}/api/books?author=${author}`;
      res.json(returnBook);
    })
    .put((req, res) => {
      const { book } = req;
      book.title = req.body.title;
      book.author = req.body.author;
      book.genre = req.body.genre;
      book.read = req.body.read;
      book.save(err => {
        if (err) return res.send(err);
        return res.json(book);
      });

      return res.status(200).json(book);
    })
    .patch((req, res) => {
      const { book } = req;

      if (req.body._id) {
        delete req.body._id;
      }

      Object.entries(req.body).forEach(item => {
        const key = item[0];
        const value = item[1];
        book[key] = value;
      });

      req.book.save(err => {
        if (err) return res.send(err);
        return res.json(book);
      });
    })
    .delete((req, res) => {
      req.book.remove(err => {
        if (err) return res.send(err);
        return res.sendStatus(204);
      });
    });

  bookRouter.route('/books').post(controller.post);

  return bookRouter;
};

module.exports = routes;
