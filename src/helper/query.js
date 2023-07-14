/* eslint-disable operator-linebreak */
/* eslint-disable prefer-promise-reject-errors */
const validator = require('validator');
const crypto = require('crypto');
const db = require('./conn');

const checkUser = (username, password) =>
  new Promise((resolve, reject) => {
    if (!username || !password) {
      reject({
        status: 400,
        error: true,
        message: 'username atau password kosong!',
        data: null,
      });
    } else {
      const hash = crypto.createHash('sha256').update(password).digest();
      const buffer = Buffer.from(hash);
      db.query(
        'SELECT * FROM admin WHERE username = ?',
        [username, buffer],
        (err, rows) => {
          if (err) {
            reject({
              status: 500,
              error: true,
              message: 'Internal server error!',
              data: err,
            });
          } else if (rows.length > 0) {
            if (rows[0].password === buffer) {
              resolve({
                status: 200,
                error: false,
                message: 'ok!',
                data: rows[0].password,
                data2: buffer,
              });
            } else {
              resolve({
                status: 400,
                error: true,
                message: 'fail!',
                data: rows[0].password,
                data2: buffer,
              });
            }
          } else {
            reject({
              status: 404,
              error: true,
              message: 'username tidak ditemukan!',
              data: null,
            });
          }
        },
      );
    }
  });

const insertToken = (token) =>
  new Promise((resolve, reject) => {
    if (!token) {
      reject({
        status: 400,
        error: true,
        message: 'token kosong!',
        data: null,
      });
    } else {
      db.query(
        'INSERT INTO admin_token (token) VALUES (?)',
        [token],
        (err, rows) => {
          if (err) {
            reject({
              status: 500,
              error: true,
              message: 'Internal server error!',
              data: err,
            });
          } else if (rows.affectedRows > 0) {
            resolve({
              status: 200,
              error: false,
              message: 'ok!',
              data: rows,
            });
          } else {
            reject({
              status: 500,
              error: true,
              message: 'insert token gagal!',
              data: null,
            });
          }
        },
      );
    }
  });

const nipGenerator = () =>
  new Promise((resolve, reject) => {
    db.query(
      'SELECT MAX(CAST(SUBSTRING(nip, 5) AS UNSIGNED)) as counter FROM karyawan',
      (err, rows) => {
        if (err) {
          reject({
            status: 500,
            error: true,
            message: 'Internal server error!',
            data: err,
          });
        } else if (rows) {
          const counter = rows[0].counter || 0;
          const nextCounter = counter + 1;
          const nip =
            new Date().getFullYear() + String(nextCounter).padStart(4, '0');
          resolve(nip);
        } else {
          reject({
            status: 500,
            error: true,
            message: 'gagal!',
            data: null,
          });
        }
      },
    );
  });

const insertKaryawan = (
  nip,
  nama,
  alamat,
  gend,
  tanggalLahir,
  photo,
  username,
) =>
  new Promise((resolve, reject) => {
    if (
      !nip ||
      !nama ||
      !alamat ||
      !gend ||
      !tanggalLahir ||
      !photo ||
      !username
    ) {
      reject({
        status: 400,
        error: true,
        message: 'input harus lengkap!',
        data: null,
      });
    }
    if (!validator.isDate(tanggalLahir)) {
      reject({
        status: 400,
        error: true,
        message: 'tanggal lahir tidak valid!',
        data: null,
      });
    }

    if (gend === 'P' || gend === 'L') {
      console.log('ok');
    } else {
      reject({
        status: 400,
        error: true,
        message: 'gender tidak valid!',
        data: gend,
      });
    }

    let photo2 = null;
    if (photo) {
      if (!validator.isBase64(photo)) {
        reject({
          status: 400,
          error: true,
          message: 'foto harus base64!',
          data: null,
        });
      }
    } else {
      photo2 = photo;
    }

    const nama2 = validator.escape(nama);
    const alamat2 = validator.escape(alamat);
    const currentDate = new Date();
    db.query(
      'INSERT INTO karyawan (nip, nama, alamat, gend, photo, tgl_lahir, status, insert_at, insert_by, update_at, update_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        nip,
        nama2,
        alamat2,
        gend,
        photo2,
        tanggalLahir,
        1,
        currentDate,
        username,
        currentDate,
        username,
      ],
      (err, rows) => {
        if (err) {
          reject({
            status: 500,
            error: true,
            message: 'Internal server error!',
            data: err,
          });
        } else if (rows.affectedRows > 0) {
          resolve({
            status: 200,
            error: false,
            message: 'ok!',
            data: rows,
          });
        } else {
          reject({
            status: 500,
            error: true,
            message: 'insert karyawan gagal!',
            data: null,
          });
        }
      },
    );
  });

const getKaryawan = (keyword, start, count) =>
  new Promise((resolve, reject) => {
    if (!keyword || !start || !count) {
      reject({
        status: 400,
        error: true,
        message: 'input harus lengkap!',
        data: null,
      });
    }
    if (!validator.isNumeric(start) || !validator.isNumeric(count)) {
      reject({
        status: 400,
        error: true,
        message: 'start atau count harus angka!',
        data: null,
      });
    }
    const keyword2 = validator.escape(keyword);
    db.query(
      'SELECT * FROM karyawan WHERE nama LIKE ? LIMIT ?, ?',
      [`%${keyword2}%`, parseInt(start, 10), parseInt(count, 10)],
      (err, rows) => {
        if (err) {
          reject({
            status: 500,
            error: true,
            message: 'Internal server error!',
            data: err,
          });
        } else if (rows) {
          resolve({
            status: 200,
            error: false,
            message: 'ok!',
            data: rows,
          });
        } else {
          reject({
            status: 500,
            error: true,
            message: 'gagal!',
            data: null,
          });
        }
      },
    );
  });

const updatesKaryawan = (
  nip,
  nama,
  alamat,
  gend,
  tanggalLahir,
  photo,
  username,
) =>
  new Promise((resolve, reject) => {
    if (
      !nip ||
      !nama ||
      !alamat ||
      !gend ||
      !tanggalLahir ||
      !photo ||
      !username
    ) {
      reject({
        status: 400,
        error: true,
        message: 'input harus lengkap!',
        data: null,
      });
    }
    if (!validator.isDate(tanggalLahir)) {
      reject({
        status: 400,
        error: true,
        message: 'tanggal lahir tidak valid!',
        data: null,
      });
    }

   
    if (gend === 'P' || gend === 'L') {
      console.log('ok');
    } else {
      reject({
        status: 400,
        error: true,
        message: 'gender tidak valid!',
        data: gend,
      });
    }


    if (!validator.isBase64(photo)) {
      reject({
        status: 400,
        error: true,
        message: 'foto harus base64!',
        data: null,
      });
    }

    const nama2 = validator.escape(nama);
    const alamat2 = validator.escape(alamat);
    const currentDate = new Date();
    db.query(
      'UPDATE karyawan SET nama = ?, alamat = ?, gend = ?, tgl_lahir = ?, photo = ?, update_at = ?, update_by = ? WHERE nip = ?',
      [nama2, alamat2, gend, tanggalLahir, photo, currentDate, username, nip],
      (err, rows) => {
        if (err) {
          reject({
            status: 500,
            error: true,
            message: 'Internal server error!',
            data: err,
          });
        } else if (rows.affectedRows > 0) {
          resolve({
            status: 200,
            error: false,
            message: 'ok!',
            data: rows,
          });
        } else {
          reject({
            status: 500,
            error: true,
            message: 'update karyawan gagal!',
            data: null,
          });
        }
      },
    );
  });

const nonaktifsKaryawan = (nip) =>
  new Promise((resolve, reject) => {
    if (!nip) {
      reject({
        status: 400,
        error: true,
        message: 'nip kosong!',
        data: null,
      });
    }
    db.query(
      'UPDATE karyawan SET status = 9 WHERE nip = ?',
      [nip],
      (err, rows) => {
        if (err) {
          reject({
            status: 500,
            error: true,
            message: 'Internal server error!',
            data: err,
          });
        } else if (rows.affectedRows > 0) {
          resolve({
            status: 200,
            error: false,
            message: 'ok!',
            data: rows,
          });
        } else {
          reject({
            status: 500,
            error: true,
            message: 'non aktif karyawan gagal!',
            data: null,
          });
        }
      },
    );
  });

module.exports = {
  checkUser,
  insertToken,
  nipGenerator,
  insertKaryawan,
  getKaryawan,
  updatesKaryawan,
  nonaktifsKaryawan,
};
