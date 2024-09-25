const sql = require('mssql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer'); // Import nodemailer
const { poolPromise } = require('../config/db');
require('dotenv').config();


// Thêm Chuyên Ngành
exports.addChuyenNganh = async (req, res) => {
    const { Tieude, UserID } = req.body;

    if (!Tieude || !UserID) {
        return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin!' });
    }

    try {
        const pool = await poolPromise;
        await pool
            .request()
            .input('Tieude', sql.NVarChar, Tieude)
            .input('UserID', sql.Int, UserID)
            .query('INSERT INTO ChuyenNganh (Tieude, UserID) VALUES (@Tieude, @UserID)');

        res.status(201).json({ message: 'Thêm chuyên ngành thành công!' });
    } catch (err) {
        console.error('Lỗi thêm chuyên ngành:', err);
        res.status(500).json({ message: 'Lỗi máy chủ', error: err.message });
    }
};

// Lấy tất cả chuyên ngành
exports.getAllChuyenNganh = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM ChuyenNganh');

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy chuyên ngành nào!' });
        }

        res.status(200).json(result.recordset);
    } catch (err) {
        console.error('Lỗi lấy danh sách chuyên ngành:', err);
        res.status(500).json({ message: 'Lỗi máy chủ', error: err.message });
    }
};

// Cập nhật chuyên ngành
exports.updateChuyenNganh = async (req, res) => {
    const { ID, Tieude, UserID } = req.body;

    if (!ID || !Tieude || !UserID) {
        return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin!' });
    }

    try {
        const pool = await poolPromise;
        const result = await pool
            .request()
            .input('ID', sql.Int, ID)
            .input('Tieude', sql.NVarChar, Tieude)
            .input('UserID', sql.Int, UserID)
            .query('UPDATE ChuyenNganh SET Tieude = @Tieude, UserID = @UserID WHERE ID = @ID');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Không tìm thấy chuyên ngành với ID đã cho!' });
        }

        res.status(200).json({ message: 'Cập nhật chuyên ngành thành công!' });
    } catch (err) {
        console.error('Lỗi cập nhật chuyên ngành:', err);
        res.status(500).json({ message: 'Lỗi máy chủ', error: err.message });
    }
};

// Xóa chuyên ngành
exports.deleteChuyenNganh = async (req, res) => {
    const { ID } = req.params;

    if (!ID) {
        return res.status(400).json({ message: 'Vui lòng cung cấp ID!' });
    }

    try {
        const pool = await poolPromise;
        const result = await pool
            .request()
            .input('ID', sql.Int, ID)
            .query('DELETE FROM ChuyenNganh WHERE ID = @ID');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Không tìm thấy chuyên ngành với ID đã cho!' });
        }

        res.status(200).json({ message: 'Xóa chuyên ngành thành công!' });
    } catch (err) {
        console.error('Lỗi khi xóa chuyên ngành:', err);
        res.status(500).json({ message: 'Lỗi máy chủ khi xóa chuyên ngành.', error: err.message });
    }
};

// Tìm kiếm chuyên ngành theo tiêu đề
exports.searchChuyenNganh = async (req, res) => {
    const { search } = req.query;

    if (!search) {
        return res.status(400).json({ message: 'Vui lòng cung cấp từ khóa tìm kiếm!' });
    }

    try {
        const pool = await poolPromise;
        const result = await pool
            .request()
            .input('searchTerm', sql.NVarChar, `%${search}%`)
            .query('SELECT * FROM ChuyenNganh WHERE Tieude LIKE @searchTerm');

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy chuyên ngành nào!' });
        }

        res.status(200).json(result.recordset);
    } catch (err) {
        console.error('Lỗi tìm kiếm chuyên ngành:', err);
        res.status(500).json({ message: 'Lỗi máy chủ', error: err.message });
    }
};
