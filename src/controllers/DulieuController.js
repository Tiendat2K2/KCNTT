
const sql = require('mssql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer'); // Import nodemailer
const { poolPromise } = require('../config/db');
require('dotenv')
exports.addDulieu = async (req, res) => {
    const { Tieude, Files, Nhomtacgia, Tapchixuatban, Thongtinmatapchi, Ghichu, UserID, ChuyenNganhID } = req.body;

    try {
        const pool = await poolPromise;
        await pool.request()
            .input('Tieude', sql.NVarChar, Tieude)
            .input('Files', sql.NVarChar, Files)
            .input('Nhomtacgia', sql.NVarChar, Nhomtacgia)
            .input('Tapchixuatban', sql.NVarChar, Tapchixuatban)
            .input('Thongtinmatapchi', sql.NVarChar, Thongtinmatapchi)
            .input('Ghichu', sql.NVarChar, Ghichu)
            .input('UserID', sql.Int, UserID)
            .input('ChuyenNganhID', sql.Int, ChuyenNganhID)
            .query('INSERT INTO Dulieu (Tieude, Files, Nhomtacgia, Tapchixuatban, Thongtinmatapchi, Ghichu, UserID, ChuyenNganhID) VALUES (@Tieude, @Files, @Nhomtacgia, @Tapchixuatban, @Thongtinmatapchi, @Ghichu, @UserID, @ChuyenNganhID)');

        res.status(201).json({ message: 'Dulieu added successfully' });
    } catch (err) {
        console.error('Error adding Dulieu:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getAllDulieu = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Dulieu');
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error('Error retrieving Dulieu:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.updateDulieu = async (req, res) => {
    const { ID, Tieude, Files, Nhomtacgia, Tapchixuatban, Thongtinmatapchi, Ghichu, UserID, ChuyenNganhID } = req.body;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('ID', sql.Int, ID)
            .input('Tieude', sql.NVarChar, Tieude)
            .input('Files', sql.NVarChar, Files)
            .input('Nhomtacgia', sql.NVarChar, Nhomtacgia)
            .input('Tapchixuatban', sql.NVarChar, Tapchixuatban)
            .input('Thongtinmatapchi', sql.NVarChar, Thongtinmatapchi)
            .input('Ghichu', sql.NVarChar, Ghichu)
            .input('UserID', sql.Int, UserID)
            .input('ChuyenNganhID', sql.Int, ChuyenNganhID)
            .query('UPDATE Dulieu SET Tieude = @Tieude, Files = @Files, Nhomtacgia = @Nhomtacgia, Tapchixuatban = @Tapchixuatban, Thongtinmatapchi = @Thongtinmatapchi, Ghichu = @Ghichu, UserID = @UserID, ChuyenNganhID = @ChuyenNganhID WHERE ID = @ID');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Dulieu not found' });
        }

        res.status(200).json({ message: 'Dulieu updated successfully' });
    } catch (err) {
        console.error('Error updating Dulieu:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.deleteDulieu = async (req, res) => {
    const { ID } = req.params;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('ID', sql.Int, ID)
            .query('DELETE FROM Dulieu WHERE ID = @ID');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Dulieu not found' });
        }

        res.status(200).json({ message: 'Dulieu deleted successfully' });
    } catch (err) {
        console.error('Error deleting Dulieu:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.searchDulieu = async (req, res) => {
    const { search } = req.query;

    if (!search) {
        return res.status(400).json({ message: 'Please provide a search term!' });
    }

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('searchTerm', sql.NVarChar, `%${search}%`) // Correctly format the input for SQL LIKE
            .query('SELECT * FROM Dulieu WHERE Tieude LIKE @searchTerm');

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'No Dulieu found matching the search criteria!' });
        }

        res.status(200).json(result.recordset);
    } catch (err) {
        console.error('Error searching Dulieu:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};
