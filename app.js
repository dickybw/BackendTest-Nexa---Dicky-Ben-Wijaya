require('dotenv').config();

const port = process.env.PORT;
const express = require('express');
const db = require('./src/helper/conn');

// Koneksi ke database MySQL
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to the database');
});

const app = express();
app.use(
  express.urlencoded({
    extended: false,
  }),
);
app.use(express.json({}));

app.use(require('./src/router/router'));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
