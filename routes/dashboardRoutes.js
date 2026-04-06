const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const { getSummary, getCategories } = require("../controllers/dashboardController");

/**
 * @swagger
 * /api/dashboard/summary:
 *   get:
 *     summary: Get dashboard summary
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: user
 *         schema:
 *           type: string
 *         description: User ID to filter summary (optional)
 *     responses:
 *       200:
 *         description: Dashboard summary data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 income:
 *                   type: number
 *                   description: Total income amount
 *                 expense:
 *                   type: number
 *                   description: Total expense amount
 *                 balance:
 *                   type: number
 *                   description: Net balance (income - expense)
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.get(
    "/summary",
    authMiddleware,
    authorizeRoles("admin", "analyst"),
    getSummary
);

/**
 * @swagger
 * /api/dashboard/categories:
 *   get:
 *     summary: Get category-wise totals
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: user
 *         schema:
 *           type: string
 *         description: User ID to filter categories (optional)
 *     responses:
 *       200:
 *         description: Category-wise totals
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: Category name
 *                       total:
 *                         type: number
 *                         description: Total amount for this category
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.get(
    "/categories",
    authMiddleware,
    authorizeRoles("admin", "analyst"),
    getCategories
);

module.exports = router;