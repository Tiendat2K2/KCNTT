const express = require('express');
const {register,login,updateUser,getAllUsers,deleteUser,updatePassword,sendVerificationEmail,logout,resetToken} = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Đăng ký người dùng mới
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Email:
 *                 type: string
 *                 format: email
 *               Username:
 *                 type: string
 *               Password:
 *                 type: string
 *             required:
 *               - Email
 *               - Username
 *               - Password
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 *       400:
 *         description: Email hoặc username đã tồn tại
 *       500:
 *         description: Lỗi máy chủ
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Đăng nhập người dùng
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Username:
 *                 type: string
 *               Password:
 *                 type: string
 *             required:
 *               - Username
 *               - Password
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *       401:
 *         description: Thông tin xác thực không hợp lệ
 *       404:
 *         description: Người dùng không tồn tại
 *       500:
 *         description: Lỗi máy chủ
 */

/**
 * @swagger
 * /api/auth/updateUser:
 *   put:
 *     tags: [Auth]
 *     summary: Cập nhật thông tin người dùng
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               UserID:
 *                 type: integer
 *               Hoten:
 *                 type: string
 *               Ngaysinh:
 *                 type: string
 *                 format: date
 *               Noisinh:
 *                 type: string
 *               Chuyenganh:
 *                 type: string
 *               Sonam:
 *                 type: integer
 *               Gioitinh:
 *                 type: string
 *               Std:
 *                 type: string
 *               Tendonvi:
 *                 type: string
 *               Nganh:
 *                 type: string
 *               Img:
 *                 type: string
 *             required:
 *               - UserID
 *     responses:
 *       200:
 *         description: Cập nhật thông tin người dùng thành công
 *       400:
 *         description: Thiếu UserID hoặc thông tin không hợp lệ
 *       404:
 *         description: Không tìm thấy người dùng với UserID đã cho
 *       500:
 *         description: Lỗi máy chủ
 */

/**
 * @swagger
 * /api/auth/getAllUsers:
 *   get:
 *     summary: Lấy danh sách tất cả người dùng
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách người dùng
 *         content:
 *           
 *       404:
 *         description: Không tìm thấy người dùng nào
 *       500:
 *         description: Lỗi máy chủ
 */

/**
 * @swagger
 * /api/auth/deleteUser/{UserID}:
 *   delete:
 *     tags: [Auth]
 *     summary: Xóa người dùng theo ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: UserID
 *         required: true
 *         description: ID của người dùng cần xóa
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Xóa người dùng thành công
 *       404:
 *         description: Không tìm thấy người dùng với UserID đã cho
 *       500:
 *         description: Lỗi máy chủ
 */

/**
 * @swagger
 * /api/auth/update-password:
 *   put:
 *     tags: [Auth]
 *     summary: Cập nhật mật khẩu người dùng
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - UserID
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               UserID:
 *                 type: integer
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật mật khẩu thành công
 *       400:
 *         description: Yêu cầu không hợp lệ hoặc mật khẩu cũ không chính xác
 *       404:
 *         description: Không tìm thấy người dùng
 *       500:
 *         description: Lỗi máy chủ
 */

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     tags: [Auth]
 *     summary: Gửi liên kết đặt lại mật khẩu đến email người dùng
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Email
 *             properties:
 *               Email:
 *                 type: string
 *                 format: email
 *                 description: Địa chỉ email của người dùng
 *     responses:
 *       200:
 *         description: Liên kết đặt lại mật khẩu đã được gửi tới email của bạn
 *       400:
 *         description: Yêu cầu không hợp lệ, thiếu email
 *       404:
 *         description: Không tìm thấy người dùng với email đã cho
 *       500:
 *         description: Lỗi máy chủ
 */
/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Đăng xuất người dùng
 *     tags: [Auth]
 *     description: Đưa token vào blacklist và thực hiện đăng xuất
 *     responses:
 *       200:
 *         description: Đăng xuất thành công
 *         content:
 *          
 *       400:
 *         description: Không tìm thấy token
 *         content:
 *          
 *                 
 */
router.post('/api/auth/register', register);
router.post('/api/auth/login', login);
router.put('/api/auth/updateUser', authMiddleware, updateUser); // Bảo vệ route updateUser
router.get('/api/auth/getAllUsers', authMiddleware, getAllUsers); // Bảo vệ route getAllUsers
router.delete('/api/auth/deleteUser/:UserID', authMiddleware, deleteUser);
router.put('/api/auth/update-password', authMiddleware, updatePassword);
router.post('/api/auth/forgot-password', sendVerificationEmail); // Thay đổi route thành forgot-password
router.post('/api/auth/logout', authMiddleware, logout);
module.exports = router;
