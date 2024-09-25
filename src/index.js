const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Thêm dòng này
const authRoutes = require('./routes/authRoutes'); // Đảm bảo đường dẫn đến authRoutes đúng
const ChuyenganhRoutes = require('./routes/ChuyenNganhRoutes')
const DulieuRoutes = require('./routes/DulieuRoutes')
const sileRoutes = require('./routes/sileRoutes')
const setupSwagger = require('./swagger/swagger');

const app = express();
app.use(cors()); // Cấu hình CORS
app.use(bodyParser.json());

// Sử dụng authRoutes tại đường dẫn gốc
app.use('/', authRoutes); // Giữ nguyên đường dẫn này
app.use('/',ChuyenganhRoutes);
app.use('/',sileRoutes);
app.use('/',DulieuRoutes);  

// Cấu hình Swagger
setupSwagger(app);
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
