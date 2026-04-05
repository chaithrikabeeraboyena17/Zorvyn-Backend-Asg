const express = require("express");
const router = express.Router();
const Record = require("../models/Record");
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// get dashboard summary
router.get(
    "/summary",
    authMiddleware,
    authorizeRoles("admin", "analyst"),
    async (req, res) => {
    try {
        const { user } = req.query;

        let matchStage = {};
        if (user) {
            matchStage.user = require("mongoose").Types.ObjectId(user);
        }

        const result = await Record.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: "$type",
                    total: { $sum: "$amount" }
                }
            }
        ]);

        let income = 0;
        let expense = 0;

        result.forEach(item => {
            if (item._id === "income") income = item.total;
            if (item._id === "expense") expense = item.total;
        });

        const balance = income - expense;

        res.status(200).json({
            message: "Summary fetched successfully",
            income,
            expense,
            balance
        });

    } catch (error) {
        res.status(500).json({
            message: "Error fetching summary",
            error: error.message
        });
    }
});


// category-wise totals
router.get(
    "/categories",
    authMiddleware,
    authorizeRoles("admin", "analyst"),
    async (req, res) => {
    try {
        const { user } = req.query;

        let matchStage = {};
        if (user) {
            matchStage.user = require("mongoose").Types.ObjectId(user);
        }

        const result = await Record.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: "$category",
                    total: { $sum: "$amount" }
                }
            }
        ]);

        res.status(200).json({
            message: "Category summary fetched successfully",
            categories: result
        });

    } catch (error) {
        res.status(500).json({
            message: "Error fetching category summary",
            error: error.message
        });
    }
});

module.exports = router;