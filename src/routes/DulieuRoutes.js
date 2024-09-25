const express = require('express');
const router = express.Router();
const {
    addDulieu,
    getAllDulieu,
    updateDulieu,
    deleteDulieu,
    searchDulieu
} = require('../controllers/DulieuController');
const authMiddleware = require('../middleware/authMiddleware'); // Adjust the path as necessary

/**
 * @swagger
 * tags:
 *   - name: Dulieu
 *     description: Operations related to Dulieu
 */

/**
 * @swagger
 * /api/dulieu:
 *   post:
 *     tags: [Dulieu]
 *     summary: Add a new Dulieu
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Tieude:
 *                 type: string
 *               Files:
 *                 type: string
 *               Nhomtacgia:
 *                 type: string
 *               Tapchixuatban:
 *                 type: string
 *               Thongtinmatapchi:
 *                 type: string
 *               Ghichu:
 *                 type: string
 *               UserID:
 *                 type: integer
 *               ChuyenNganhID:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Dulieu added successfully
 *       400:
 *         description: Bad request if the input is invalid
 *       500:
 *         description: Internal server error
 */
router.post('/api/dulieu', authMiddleware, addDulieu);

/**
 * @swagger
 * /api/dulieu:
 *   get:
 *     tags: [Dulieu]
 *     summary: Retrieve all Dulieu
 *     responses:
 *       200:
 *         description: A list of Dulieu
 *       500:
 *         description: Internal server error
 */
router.get('/api/dulieu', authMiddleware, getAllDulieu);

/**
 * @swagger
 * /api/dulieu:
 *   put:
 *     tags: [Dulieu]
 *     summary: Update an existing Dulieu
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ID:
 *                 type: integer
 *               Tieude:
 *                 type: string
 *               Files:
 *                 type: string
 *               Nhomtacgia:
 *                 type: string
 *               Tapchixuatban:
 *                 type: string
 *               Thongtinmatapchi:
 *                 type: string
 *               Ghichu:
 *                 type: string
 *               UserID:
 *                 type: integer
 *               ChuyenNganhID:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Dulieu updated successfully
 *       400:
 *         description: Bad request if the input is invalid
 *       404:
 *         description: Dulieu not found
 *       500:
 *         description: Internal server error
 */
router.put('/api/dulieu', authMiddleware, updateDulieu);

/**
 * @swagger
 * /api/dulieu/{ID}:
 *   delete:
 *     tags: [Dulieu]
 *     summary: Delete a Dulieu
 *     parameters:
 *       - name: ID
 *         in: path
 *         required: true
 *         description: ID of the Dulieu to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dulieu deleted successfully
 *       404:
 *         description: Dulieu not found
 *       500:
 *         description: Internal server error
 */
router.delete('/api/dulieu/:ID', authMiddleware, deleteDulieu);

/**
 * @swagger
 * /api/dulieu/search:
 *   get:
 *     tags: [Dulieu]
 *     summary: Search for Dulieu by title
 *     parameters:
 *       - name: search
 *         in: query
 *         required: true
 *         description: The search term to filter Dulieu by title
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of Dulieu that match the search criteria
 *       400:
 *         description: Bad request if the search term is not provided
 *       404:
 *         description: No Dulieu found matching the search criteria
 *       500:
 *         description: Internal server error
 */
router.get('/api/dulieu/search', authMiddleware, searchDulieu);

module.exports = router;
