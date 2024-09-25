const sql = require('mssql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer'); // Import nodemailer
const { poolPromise } = require('../config/db');
require('dotenv').config();
// Đăng ký người dùng
exports.register = async (req, res) => {
    const { Email, Username, Password } = req.body;

    // Kiểm tra xem các trường có rỗng không
    if (!Email || !Username || !Password) {
        return res.status(400).json({ message: 'Vui lòng nhập tất cả các trường!' });
    }

    // Kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}[^0-9]*$/;
    if (!emailRegex.test(Email)) {
        return res.status(400).json({ message: 'Địa chỉ email không hợp lệ! Vui lòng kiểm tra định dạng email của bạn.' });
    }

    try {
        const pool = await poolPromise;
        const hashedPassword = await bcrypt.hash(Password, 10);

        const checkUser = await pool
            .request()
            .input('email', sql.NVarChar, Email)
            .query('SELECT * FROM Users WHERE Email = @email');

        if (checkUser.recordset.length > 0) {
            return res.status(400).json({ message: 'Email đã được đăng ký!' });
        }

        const checkUsername = await pool
            .request()
            .input('username', sql.NVarChar, Username)
            .query('SELECT * FROM Users WHERE Username = @username');

        if (checkUsername.recordset.length > 0) {
            return res.status(400).json({ message: 'Username đã được đăng ký!' });
        }

        const usersCount = await pool
            .request()
            .query('SELECT COUNT(*) AS count FROM Users');

        const roleID = usersCount.recordset[0].count === 0 ? 1 : 2;

        await pool
            .request()
            .input('username', sql.NVarChar, Username)
            .input('email', sql.NVarChar, Email)
            .input('password', sql.NVarChar, hashedPassword)
            .input('roleID', sql.Int, roleID)
            .query('INSERT INTO Users (Username, Email, Password, RoleID) VALUES (@username, @email, @password, @roleID)');

        res.status(201).json({ message: 'Đăng ký thành công!' });
    } catch (err) {
        console.error('Đăng ký lỗi:', err);
        res.status(500).json({ message: 'Lỗi máy chủ', error: err.message });
    }
};
// Đăng nhập người dùng
exports.login = async (req, res) => {
    const { Username, Password } = req.body;

    if (!Username || !Password) {
        return res.status(400).json({ message: 'Vui lòng nhập tên đăng nhập và mật khẩu!' });
    }

    try {
        const pool = await poolPromise;

        const user = await pool
            .request()
            .input('username', sql.NVarChar, Username)
            .query('SELECT RoleID, Email, Username, Password FROM Users WHERE Username = @username');

        if (user.recordset.length === 0) {
            return res.status(400).json({ status: 0, message: 'Sai tên đăng nhập hoặc mật khẩu!' });
        }

        const validPassword = await bcrypt.compare(Password, user.recordset[0].Password);
        if (!validPassword) {
            return res.status(400).json({ status: 0, message: 'Sai tên đăng nhập hoặc mật khẩu!' });
        }

        const roleId = user.recordset[0].RoleID;
        const token = jwt.sign({ id: user.recordset[0].Username, roleId }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ status: 1, message: 'Đăng nhập thành công!', token, roleId });
    } catch (err) {
        console.error('Đăng nhập lỗi:', err);
        res.status(500).json({ message: 'Lỗi máy chủ', error: err.message });
    }
};
// Cập nhật thông tin người dùng
exports.updateUser = async (req, res) => {
    const { UserID, Hoten, Ngaysinh, Noisinh, Chuyenganh, Sonam, Gioitinh, Std, Tendonvi, Nganh, Img } = req.body;

    if (!UserID) {
        return res.status(400).json({ message: 'Vui lòng cung cấp UserID!' });
    }

    try {
        const pool = await poolPromise;

        const result = await pool
            .request()
            .input('UserID', sql.Int, UserID)
            .input('Hoten', sql.NVarChar, Hoten)
            .input('Ngaysinh', sql.Date, Ngaysinh)
            .input('Noisinh', sql.NVarChar, Noisinh)
            .input('Chuyenganh', sql.NVarChar, Chuyenganh)
            .input('Sonam', sql.Int, Sonam)
            .input('Gioitinh', sql.NVarChar, Gioitinh)
            .input('Std', sql.NVarChar, Std)
            .input('Tendonvi', sql.NVarChar, Tendonvi)
            .input('Nganh', sql.NVarChar, Nganh)
            .input('Img', sql.NVarChar, Img)
            .query(`
                UPDATE Users
                SET Hoten = @Hoten,
                    Ngaysinh = @Ngaysinh,
                    Noisinh = @Noisinh,
                    Chuyenganh = @Chuyenganh,
                    Sonam = @Sonam,
                    Gioitinh = @Gioitinh,
                    Std = @Std,
                    Tendonvi = @Tendonvi,
                    Nganh = @Nganh,
                    Img = @Img
                WHERE UserID = @UserID
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng với UserID đã cho!' });
        }

        res.status(200).json({ message: 'Cập nhật thông tin người dùng thành công!' });
    } catch (err) {
        console.error('Lỗi cập nhật thông tin người dùng:', err);
        res.status(500).json({ message: 'Lỗi máy chủ', error: err.message });
    }
};

// Lấy tất cả người dùng
exports.getAllUsers = async (req, res) => {
    try {
        const pool = await poolPromise;

        const result = await pool
            .request()
            .query('SELECT * FROM Users');

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng nào!' });
        }

        res.status(200).json(result.recordset);
    } catch (err) {
        console.error('Lỗi lấy danh sách người dùng:', err);
        res.status(500).json({ message: 'Lỗi máy chủ', error: err.message });
    }
};

// Xóa người dùng
exports.deleteUser = async (req, res) => {
    const { UserID } = req.params;

    if (!UserID) {
        return res.status(400).json({ message: 'Vui lòng cung cấp UserID!' });
    }

    try {
        const pool = await poolPromise;

        const result = await pool
            .request()
            .input('UserID', sql.Int, UserID)
            .query('DELETE FROM Users WHERE UserID = @UserID');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng với UserID đã cho.' });
        }

        res.status(200).json({ message: 'Xóa người dùng thành công!' });
    } catch (error) {
        console.error('Lỗi khi xóa người dùng:', error);
        res.status(500).json({ message: 'Lỗi máy chủ khi xóa người dùng.', error: error.message });
    }
};

// Cập nhật mật khẩu
exports.updatePassword = async (req, res) => {
    const { UserID, oldPassword, newPassword } = req.body;

    if (!UserID || !oldPassword || !newPassword) {
        return res.status(400).json({ message: 'Vui lòng nhập tất cả các trường!' });
    }

    try {
        const pool = await poolPromise;

        const user = await pool
            .request()
            .input('UserID', sql.Int, UserID)
            .query('SELECT Password FROM Users WHERE UserID = @UserID');

        if (user.recordset.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng!' });
        }

        const validPassword = await bcrypt.compare(oldPassword, user.recordset[0].Password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Mật khẩu cũ không chính xác!' });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        await pool
            .request()
            .input('UserID', sql.Int, UserID)
            .input('Password', sql.NVarChar, hashedNewPassword)
            .query('UPDATE Users SET Password = @Password WHERE UserID = @UserID');

        res.status(200).json({ message: 'Cập nhật mật khẩu thành công!' });
    } catch (err) {
        console.error('Lỗi cập nhật mật khẩu:', err);
        res.status(500).json({ message: 'Lỗi máy chủ', error: err.message });
    }
};
function generateRandomPassword(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return password;
}
// Gửi email xác thực
exports.sendVerificationEmail = async (req, res) => {
    const { Email } = req.body;

    if (!Email) {
        return res.status(400).json({ message: 'Vui lòng cung cấp địa chỉ email!' });
    }

    try {
        const pool = await poolPromise;

        // Kiểm tra email tồn tại
        const user = await pool
            .request()
            .input('email', sql.NVarChar, Email)
            .query('SELECT UserID FROM Users WHERE Email = @email');

        if (user.recordset.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy tài khoản với email đã cho!' });
        }

        // Tạo mật khẩu mới
        const newPassword = generateRandomPassword(10);
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Cập nhật mật khẩu mới vào cơ sở dữ liệu
        await pool
            .request()
            .input('UserID', sql.Int, user.recordset[0].UserID)
            .input('Password', sql.NVarChar, hashedNewPassword)
            .query('UPDATE Users SET Password = @Password WHERE UserID = @UserID');

        // Cấu hình gửi email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: Email,
            subject: 'Mật khẩu mới của bạn',
            text: `Mật khẩu mới của bạn là: ${newPassword}`,
        };

        // Gửi email
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Mật khẩu mới đã được gửi tới email của bạn!' });
    } catch (err) {
        console.error('Lỗi khi đặt lại mật khẩu:', err);
        res.status(500).json({ message: 'Lỗi máy chủ', error: err.message });
    }
};
exports.getAllUserslike = async (req, res) => {
    const { search } = req.query;
    if (!search) {
        return res.status(400).json({ message: 'Vui lòng cung cấp từ khóa tìm kiếm!' });
    }
    try {
        const pool = await poolPromise;
        const result = await pool
            .request()
            .input('searchTerm', sql.NVarChar, `%${search}%`)
            .query(`
                SELECT Hoten, Ngaysinh, Noisinh, Chuyenganh, Sonam, Gioitinh, Std, Tendonvi, Nganh, Img
                FROM Users
                WHERE Hoten LIKE @searchTerm
            `);
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng nào!' });
        }
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error('Lỗi lấy danh sách người dùng theo tên:', err);
        res.status(500).json({ message: 'Lỗi máy chủ', error: err.message });
    }
};
let tokenBlacklist = []; // Mảng lưu trữ token đã đăng xuất

function blacklistToken(token) {
    tokenBlacklist.push(token); // Thêm token vào blacklist
}

exports.logout = (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Lấy token từ header

    if (token) {
        blacklistToken(token); // Đưa token vào blacklist
        return res.status(200).json({ status: 1, message: 'Đăng xuất thành công!' });
    } else {
        return res.status(400).json({ status: 0, message: 'Không tìm thấy token!' });
    }
};
exports.resetToken = async (req, res) => {
    const { Username, refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ message: 'Vui lòng cung cấp refresh token!' });
    }

    try {
        const pool = await poolPromise;

        // Kiểm tra xem refresh token có hợp lệ hay không
        const result = await pool
            .request()
            .input('username', sql.NVarChar, Username)
            .input('refreshToken', sql.NVarChar, refreshToken)
            .query('SELECT RefreshToken FROM Users WHERE Username = @username AND RefreshToken = @refreshToken');

        if (result.recordset.length === 0) {
            return res.status(401).json({ message: 'Refresh token không hợp lệ!' });
        }

        // Tạo token mới
        const newToken = jwt.sign(
            { id: Username, roleId: result.recordset[0].RoleID },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.json({ status: 1, message: 'Token đã được reset thành công!', token: newToken });
    } catch (err) {
        console.error('Lỗi reset token:', err);
        return res.status(500).json({ message: 'Lỗi máy chủ', error: err.message });
    }
};