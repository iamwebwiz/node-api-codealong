/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable arrow-parens */
const express = require('express');

const bookRouter = express.Router();

const routes = Book => {
  bookRouter.route('/books').get((req, res) => {
    const query = {};

    if (req.query.author) {
      query.author = req.query.author;
    }

    Book.find(query, (err, books) => {
      if (err) return res.send(err);
      return res.json(books);
    });
  });

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
    .get((req, res) => res.json(req.book))
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
    });

  bookRouter.route('/books').post((req, res) => {
    const book = new Book(req.body);
    book.save();
    return res.status(201).json(book);
  });

  return bookRouter;
};

module.exports = routes;
