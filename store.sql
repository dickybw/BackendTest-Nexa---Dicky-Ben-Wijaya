DELIMITER //

CREATE PROCEDURE sp_add_kary_Dicky_Ben_Wijaya(IN p_nip VARCHAR(20), IN p_nama VARCHAR(100), IN p_alamat VARCHAR(200), IN p_gender VARCHAR(10), IN p_tanggal_lahir DATE)
BEGIN
  DECLARE v_success INT DEFAULT 0;
  
  DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    SET v_success = 0;
  END;
  
  START TRANSACTION;
  
  INSERT INTO karyawan (nip, nama, alamat, gender, tanggal_lahir)
  VALUES (p_nip, p_nama, p_alamat, p_gender, p_tanggal_lahir);
  
  INSERT INTO log_trx_api (nip, status)
  VALUES (p_nip, IF(v_success = 0, 'Gagal', 'Berhasil'));
  
  IF v_success = 0 THEN
    ROLLBACK;
  ELSE
    COMMIT;
  END IF;
  
END //

DELIMITER ;
