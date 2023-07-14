/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable arrow-body-style */
require('dotenv').config();
const jwt = require('jsonwebtoken');

const secretKey = process.env.SECRET;

const generateToken = (username, password) =>
  new Promise((resolve, reject) => {
    const token = jwt.sign({ username, password }, secretKey, {
      expiresIn: '1h',
    });
    if (token) {
      resolve(token);
    } else {
      reject('token generation error');
    }
  });

module.exports = {
  generateToken,
};
