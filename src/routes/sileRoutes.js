const express = require('express');
const router = express.Router();
const {
    addSile,
    getAllSile,
    updateSile,
    deleteSile,
    searchSile
    
} = require('../controllers/SileController');
const authMiddleware = require('../middleware/authMiddleware'); // Adjust the path as necessary

/**
 * @swagger
 * tags:
 *   - name: Sile
 *     description: Operations related to Sile
 */

/**
 * @swagger
 * /api/sile:
 *   post:
 *     tags: [Sile]
 *     summary: Add a new Sile
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Img:
 *                 type: string
 *               Mota:
 *                 type: string
 *               UserID:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Sile added successfully
 *       400:
 *         description: Bad request if the input is invalid
 *       500:
 *         description: Internal server error
 */
router.post('/api/sile', authMiddleware, addSile);

/**
 * @swagger
 * /api/sile:
 *   get:
 *     tags: [Sile]
 *     summary: Retrieve all Sile
 *     responses:
 *       200:
 *         description: A list of Sile
 *       404:
 *         description: No Sile found
 *       500:
 *         description: Internal server error
 */
router.get('/api/sile', authMiddleware, getAllSile);

/**
 * @swagger
 * /api/sile:
 *   put:
 *     tags: [Sile]
 *     summary: Update an existing Sile
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ID:
 *                 type: integer
 *               Img:
 *                 type: string
 *               Mota:
 *                 type: string
 *               UserID:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Sile updated successfully
 *       400:
 *         description: Bad request if the input is invalid
 *       404:
 *         description: Sile not found
 *       500:
 *         description: Internal server error
 */
router.put('/api/sile', authMiddleware, updateSile);

/**
 * @swagger
 * /api/sile/{ID}:
 *   delete:
 *     tags: [Sile]
 *     summary: Delete a Sile
 *     parameters:
 *       - name: ID
 *         in: path
 *         required: true
 *         description: ID of the Sile to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Sile deleted successfully
 *       404:
 *         description: Sile not found
 *       500:
 *         description: Internal server error
 */
router.delete('/api/sile/:ID', authMiddleware,deleteSile);

/**
 * @swagger
 * /api/sile/search:
 *   get:
 *     tags: [Sile]
 *     summary: Search for Sile by description
 *     parameters:
 *       - name: search
 *         in: query
 *         required: true
 *         description: The description to search for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of Sile matching the search criteria
 *       400:
 *         description: Bad request if the search term is not provided
 *       404:
 *         description: No Sile found matching the search criteria
 *       500:
 *         description: Internal server error
 */
router.get('/api/sile/search', authMiddleware,searchSile);

module.exports = router;
