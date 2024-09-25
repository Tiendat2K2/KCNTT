const express = require('express');
const router = express.Router();
const {
    addChuyenNganh,
    getAllChuyenNganh,
    updateChuyenNganh,
    deleteChuyenNganh,
    searchChuyenNganh
} = require('../controllers/ChuyenNganhController');
const authMiddleware = require('../middleware/authMiddleware'); // Ensure you have this middleware

/**
 * @swagger
 * tags:
 *   - name: Chuyenganh
 *     description: Operations related to ChuyenNganh
 */

/**
 * @swagger
 * /api/chuyen-nganh:
 *   post:
 *     tags: [Chuyenganh]
 *     summary: Add a new ChuyenNganh
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Tieude:
 *                 type: string
 *               UserID:
 *                 type: integer
 *     responses:
 *       201:
 *         description: ChuyenNganh added successfully
 *       400:
 *         description: Bad request if the input is invalid
 *       500:
 *         description: Internal server error
 */

router.post('/api/chuyen-nganh', authMiddleware, addChuyenNganh);

/**
 * @swagger
 * /api/chuyen-nganh:
 *   get:
 *     tags: [Chuyenganh]
 *     summary: Retrieve all ChuyenNganh
 *     responses:
 *       200:
 *         description: A list of ChuyenNganh
 *       404:
 *         description: No ChuyenNganh found
 *       500:
 *         description: Internal server error
 */
router.get('/api/chuyen-nganh', authMiddleware, getAllChuyenNganh);

/**
 * @swagger
 * /api/chuyen-nganh:
 *   put:
 *     tags: [Chuyenganh]
 *     summary: Update an existing ChuyenNganh
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
 *               UserID:
 *                 type: integer
 *     responses:
 *       200:
 *         description: ChuyenNganh updated successfully
 *       400:
 *         description: Bad request if the input is invalid
 *       404:
 *         description: ChuyenNganh not found
 *       500:
 *         description: Internal server error
 */
router.put('/api/chuyen-nganh', authMiddleware, updateChuyenNganh);

/**
 * @swagger
 * /api/chuyen-nganh/{ID}:
 *   delete:
 *     tags: [Chuyenganh]
 *     summary: Delete a ChuyenNganh
 *     parameters:
 *       - name: ID
 *         in: path
 *         required: true
 *         description: ID of the ChuyenNganh to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: ChuyenNganh deleted successfully
 *       400:
 *         description: Bad request if ID is not provided
 *       404:
 *         description: ChuyenNganh not found
 *       500:
 *         description: Internal server error
 */
router.delete('/api/chuyen-nganh/:ID', authMiddleware, deleteChuyenNganh);

/**
 * @swagger
 * /api/chuyen-nganh/search:
 *   get:
 *     tags: [Chuyenganh]
 *     summary: Search for ChuyenNganh by title
 *     parameters:
 *       - name: search
 *         in: query
 *         required: true
 *         description: The title to search for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of ChuyenNganh matching the search criteria
 *       400:
 *         description: Bad request if the search term is not provided
 *       404:
 *         description: No ChuyenNganh found matching the search criteria
 *       500:
 *         description: Internal server error
 */
router.get('/api/chuyen-nganh/search', authMiddleware,searchChuyenNganh);
module.exports = router;
