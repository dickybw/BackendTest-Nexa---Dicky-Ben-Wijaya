const {
  checkUser,
  insertToken,
  nipGenerator,
  insertKaryawan,
  getKaryawan,
  updatesKaryawan,
  nonaktifsKaryawan,
} = require('../helper/query');
const { generateToken } = require('../helper/jwt');

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const Uname = await checkUser(username, password);
    if (Uname.status === 200) {
      const token = await generateToken(username, password);
      const insToken = await insertToken(token);
      res.status(200).json(insToken);
    } else {
      res.status(400).json({
        status: 400,
        error: true,
        message: 'username atau password salah!',
        data: null,
      });
    }
  } catch (error) {
    if (error.status) {
      res.status(error.status).json(error);
    } else {
      res.status(500).json({
        code: 500,
        error: true,
        message: 'interval server error!',
        data: null,
      });
    }
  }
};

const registerKaryawan = async (req, res) => {
  try {
    const { nama, alamat, gender, tanggalLahir, photo, username } = req.body;
    const nip = await nipGenerator();
    const data = await insertKaryawan(
      nip,
      nama,
      alamat,
      gender,
      tanggalLahir,
      photo,
      username,
    );
    res.status(200).json(data);
  } catch (error) {
    if (error.status) {
      res.status(error.status).json(error);
    } else {
      res.status(500).json({
        code: 500,
        error: true,
        message: 'interval server error!',
        data: null,
      });
    }
  }
};

const listKaryawan = async (req, res) => {
  try {
    const { keyword, start, count } = req.body;
    const data = await getKaryawan(keyword, start, count);
    res.status(200).json(data);
  } catch (error) {
    if (error.status) {
      res.status(error.status).json(error);
    } else {
      res.status(500).json({
        code: 500,
        error: true,
        message: 'interval server error!',
        data: null,
      });
    }
  }
};

const updateKaryawan = async (req, res) => {
  try {
    const { nip } = req.params;
    const { nama, alamat, gender, tanggalLahir, photo, username } = req.body;
    const data = await updatesKaryawan(
      nip,
      nama,
      alamat,
      gender,
      tanggalLahir,
      photo,
      username,
    );
    res.status(200).json(data);
  } catch (error) {
    if (error.status) {
      res.status(error.status).json(error);
    } else {
      res.status(500).json({
        code: 500,
        error: true,
        message: 'interval server error!',
        data: null,
      });
    }
  }
};

const nonaktifkanKaryawan = async (req, res) => {
  try {
    const { nip } = req.params;
    const data = await nonaktifsKaryawan(nip);
    res.status(200).json(data);
  } catch (error) {
    if (error.status) {
      res.status(error.status).json(error);
    } else {
      res.status(500).json({
        code: 500,
        error: true,
        message: 'interval server error!',
        data: null,
      });
    }
  }
};

module.exports = {
  login,
  registerKaryawan,
  listKaryawan,
  updateKaryawan,
  nonaktifkanKaryawan,
};
