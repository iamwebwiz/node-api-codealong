/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');

const app = express();

if (process.env.ENV === 'test') {
  const db = mongoose.connect('mongodb://localhost/booksApi-test', { useNewUrlParser: true });
} else {
  const db = mongoose.connect('mongodb://localhost/booksApi', { useNewUrlParser: true });
}
const Book = require('./models/Book');
const bookRouter = require('./routes/bookRouter')(Book);

const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/api', bookRouter);

app.get('/', (req, res) => {
  res.send('Welcome to my API');
});

app.server = app.listen(port, () => console.log(`App running on port ${port}`));

module.exports = app;
