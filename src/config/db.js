const sql = require('mssql');
require('dotenv').config();

const sqlConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  server: process.env.DB_SERVER,
  options: {
    encrypt: false, // Thay đổi thành true nếu bạn sử dụng Azure hoặc cần mã hóa kết nối
    trustServerCertificate: true, // Có thể cần thiết trong môi trường phát triển
  },
};

const poolPromise = new sql.ConnectionPool(sqlConfig)
  .connect()
  .then(pool => {
    console.log('Kết nối SQL Server thành công');
    return pool;
  })
  .catch(err => {
    console.error('Lỗi kết nối SQL Server', err);
    throw err; // Ném lại lỗi để middleware xử lý
  });

module.exports = {
  sql,
  poolPromise,
};
