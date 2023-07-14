/* eslint-disable consistent-return */
require('dotenv').config();
const { Router } = require('express');
const jwt = require('jsonwebtoken');

const secretKey = process.env.SECRET;

const router = Router();
const {
  login,
  registerKaryawan,
  listKaryawan,
  updateKaryawan,
  nonaktifkanKaryawan,
} = require('../controller/api');

// Middleware untuk otentikasi token
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

router.post('/login', authenticateToken, login);
router.post('/register', authenticateToken, registerKaryawan);
router.post('/list', listKaryawan);
router.put('/update/:nip', authenticateToken, updateKaryawan);
router.put('/nonaktif/:nip', authenticateToken, nonaktifkanKaryawan);

module.exports = router;
