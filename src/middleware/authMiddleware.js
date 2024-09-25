const jwt = require('jsonwebtoken');

// Middleware để kiểm tra token
const authMiddleware = (req, res, next) => {
    // Lấy token từ header Authorization
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Không có token' });
    }
    // Kiểm tra token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Token không hợp lệ' });
        }
        // Lưu thông tin người dùng vào req để sử dụng sau này
        req.user = decoded;
        next(); // Tiếp tục đến middleware hoặc route tiếp theo
    });
};

module.exports = authMiddleware;
