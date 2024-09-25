const sql = require('mssql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer'); // Import nodemailer
const { poolPromise } = require('../config/db');
require('dotenv').config();

// Add a new Sile
exports.addSile = async (req, res) => {
    const { Img, Mota, UserID } = req.body;

    try {
        const pool = await poolPromise;
        await pool
            .request()
            .input('Img', sql.NVarChar, Img)
            .input('Mota', sql.NVarChar, Mota)
            .input('UserID', sql.Int, UserID)
            .query('INSERT INTO Sile (Img, Mota, UserID) VALUES (@Img, @Mota, @UserID)');

        res.status(201).json({ message: 'Sile added successfully' });
    } catch (err) {
        console.error('Error adding Sile:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get all Sile
exports.getAllSile = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Sile');

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'No Sile found' });
        }

        res.status(200).json(result.recordset);
    } catch (err) {
        console.error('Error retrieving Sile:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update an existing Sile
exports.updateSile = async (req, res) => {
    const { ID, Img, Mota, UserID } = req.body;

    try {
        const pool = await poolPromise;
        const result = await pool
            .request()
            .input('ID', sql.Int, ID)
            .input('Img', sql.NVarChar, Img)
            .input('Mota', sql.NVarChar, Mota)
            .input('UserID', sql.Int, UserID)
            .query('UPDATE Sile SET Img = @Img, Mota = @Mota, UserID = @UserID WHERE ID = @ID');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Sile not found' });
        }

        res.status(200).json({ message: 'Sile updated successfully' });
    } catch (err) {
        console.error('Error updating Sile:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Delete a Sile
exports.deleteSile = async (req, res) => {
    const { ID } = req.params;

    try {
        const pool = await poolPromise;
        const result = await pool
            .request()
            .input('ID', sql.Int, ID)
            .query('DELETE FROM Sile WHERE ID = @ID');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Sile not found' });
        }

        res.status(200).json({ message: 'Sile deleted successfully' });
    } catch (err) {
        console.error('Error deleting Sile:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Search for Sile by description
exports.searchSile = async (req, res) => {
    const { search } = req.query;

    if (!search) {
        return res.status(400).json({ message: 'Please provide a search term' });
    }

    try {
        const pool = await poolPromise;
        const result = await pool
            .request()
            .input('searchTerm', sql.NVarChar, `%${search}%`)
            .query('SELECT * FROM Sile WHERE Mota LIKE @searchTerm');

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'No Sile found matching the search criteria' });
        }

        res.status(200).json(result.recordset);
    } catch (err) {
        console.error('Error searching Sile:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};
