const express = require('express');
const Sequelize = require('sequelize');
const app = express();
// parse incoming requests
app.use(express.json());
// create a connection to the database
const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  storage: './Database/SQBooks.sqlite'
});

// define the Book model
const Book = sequelize.define('book', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  author: {
    type: Sequelize.STRING,
    allowNull: false
  }
});
// create the books table if it doesn't exist 
sequelize.sync();

// route to get all books
app.get('/books', (req, res) => {
  Book.findAll().then(books => {
    res.json(books);
  }).catch(err => {
    console.error(err); // แสดงข้อผิดพลาดใน Console
    res.status(500).send('Internal Server Error');
  });
});
// route to get a book by id
app.get('/books/:id', (req, res) => {
  Book.findByPk(req.params.id).then(book => {
    if (!book) {
      res.status(404).send('Book not found');
    } else {
      res.json(book);
    }
  }).catch(err => {
    console.error(err); // แสดงข้อผิดพลาดใน Console
    res.status(500).send('Internal Server Error');
  });
});

// route to create a new book
app.post('/books', (req, res) => {
  Book.create(req.body).then(book => {
    res.send(book);
  }).catch(err => {
    console.error(err); // แสดงข้อผิดพลาดใน Console
    res.status(500).send('Internal Server Error');
  });
});
// route to update a book
app.put('/books/:id', (req, res) => {
  Book.findByPk(req.params.id).then(book => {
    if (!book) {
      res.status(404).send('Book not found');
    } else {
      book.update(req.body).then(() => {
        res.send(book);
      }).catch(err => {
        console.error(err); // แสดงข้อผิดพลาดใน Console
        res.status(500).send('Internal Server Error');
      });
    }
  }).catch(err => {
    console.error(err); // แสดงข้อผิดพลาดใน Console
    res.status(500).send('Internal Server Error');
  });
});
// route to delete a book
app.delete('/books/:id', (req, res) => {
  Book.findByPk(req.params.id).then(book => {
    if (!book) {
      res.status(404).send('Book not found');
    } else {
      book.destroy().then(() => {
        res.send({});
      }).catch(err => {
        console.error(err); // แสดงข้อผิดพลาดใน Console
        res.status(500).send('Internal Server Error');
      });
    }
  }).catch(err => {
    console.error(err); // แสดงข้อผิดพลาดใน Console
    res.status(500).send('Internal Server Error');
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

