const express = require('express');
const mongoose = require('mongoose');

const app = express();
const db = mongoose.connect('mongodb://localhost/booksApi', {
  useNewUrlParser: true,
});
const bookRouter = express.Router();
const port = process.env.PORT || 3000;
const Book = require('./models/Book');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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

bookRouter.route('/books/:bookId').get((req, res) => {
  Book.findById(req.params.bookId, (err, book) => {
    if (err) return res.send(err);
    return res.json(book);
  });
});

bookRouter.route('/books').post((req, res) => {
  const book = new Book(req.body);
  console.log(book);
  return res.json(book);
});

app.use('/api', bookRouter);

app.get('/', (req, res) => {
  res.send('Welcome to my API');
});

app.listen(port, () => console.log(`App running on port ${port}`));
