const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const express = require("express");
const router = express.Router();

const { getRecords, createRecord, updateRecord, deleteRecord } = require("../controllers/recordController");

/**
 * @swagger
 * /api/records:
 *   get:
 *     summary: Get records with pagination and filters
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Number of records per page
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [income, expense]
 *         description: Record type filter
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Record category filter
 *       - in: query
 *         name: user
 *         schema:
 *           type: string
 *         description: User ID filter
 *     responses:
 *       200:
 *         description: List of records
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 records:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       amount:
 *                         type: number
 *                       type:
 *                         type: string
 *                         enum: [income, expense]
 *                       category:
 *                         type: string
 *                       date:
 *                         type: string
 *                         format: date-time
 *                       note:
 *                         type: string
 *                       user:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           email:
 *                             type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       403:
 *         description: Forbidden
 */
router.get("/", getRecords);

/**
 * @swagger
 * /api/records:
 *   post:
 *     summary: Create a new record
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - type
 *               - category
 *             properties:
 *               amount:
 *                 type: number
 *                 description: Record amount
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *                 description: Record type
 *               category:
 *                 type: string
 *                 description: Record category
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Record date
 *               note:
 *                 type: string
 *                 description: Optional note for the record
 *     responses:
 *       201:
 *         description: Record created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 record:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     amount:
 *                       type: number
 *                     type:
 *                       type: string
 *                       enum: [income, expense]
 *                     category:
 *                       type: string
 *                     date:
 *                       type: string
 *                       format: date-time
 *                     note:
 *                       type: string
 *       400:
 *         description: Bad request
 *       403:
 *         description: Forbidden
 */
router.post(
    "/",
    authMiddleware,
    authorizeRoles("admin"),
    createRecord
);

/**
 * @swagger
 * /api/records/{id}:
 *   put:
 *     summary: Update a record
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Record ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *               category:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               note:
 *                 type: string
 *     responses:
 *       200:
 *         description: Record updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 record:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     amount:
 *                       type: number
 *                     type:
 *                       type: string
 *                       enum: [income, expense]
 *                     category:
 *                       type: string
 *                     date:
 *                       type: string
 *                       format: date-time
 *                     note:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Record not found
 */
router.put(
    "/:id",
    authMiddleware,
    authorizeRoles("admin"),
    updateRecord
);

/**
 * @swagger
 * /api/records/{id}:
 *   delete:
 *     summary: Delete a record
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Record ID
 *     responses:
 *       200:
 *         description: Record deleted successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Record not found
 */
router.delete(
    "/:id",
    authMiddleware,
    authorizeRoles("admin"),
    deleteRecord
);

module.exports = router;