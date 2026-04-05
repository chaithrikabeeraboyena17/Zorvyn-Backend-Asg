const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const express = require("express");
const router = express.Router();

const Record = require("../models/Record");

// get records with filters
router.get("/", async (req, res) => {
    try {
        const { user, type, category, page = 1, limit = 5 } = req.query;

       let filter = { isDeleted: false };

        if (user) filter.user = user;
        if (type) filter.type = type;
        if (category) filter.category = category;

        const skip = (page - 1) * limit;

        const records = await Record.find(filter)
            .populate("user", "name email")
            .skip(skip)
            .limit(parseInt(limit));

        res.status(200).json({
            message: "Records fetched successfully",
            page: parseInt(page),
            limit: parseInt(limit),
            records
        });

    } catch (error) {
        res.status(500).json({
            message: "Error fetching records",
            error: error.message
        });
    }
});

// create record
router.post(
    "/",
    authMiddleware,
    authorizeRoles("admin"),
    async (req, res) => {
        try {
            const { amount, type, category, date, note } = req.body;

            if (!amount || !type || !category) {
                return res.status(400).json({
                    message: "Amount, type, and category are required"
                });
            }

            const record = new Record({
                amount,
                type,
                category,
                date,
                note,
                user: req.user.id
            });

            await record.save();

            res.status(201).json({
                message: "Record created successfully",
                record
            });

        } catch (error) {
            res.status(500).json({
                message: "Error creating record",
                error: error.message
            });
        }
    }
);

// update record
router.put(
    "/:id",
    authMiddleware,
    authorizeRoles("admin"),
    async (req, res) => {
        try {
            const recordId = req.params.id;

            const updatedRecord = await Record.findByIdAndUpdate(
                recordId,
                req.body,
                { new: true }
            );

            if (!updatedRecord) {
                return res.status(404).json({
                    message: "Record not found"
                });
            }

            res.status(200).json({
                message: "Record updated successfully",
                record: updatedRecord
            });

        } catch (error) {
            res.status(500).json({
                message: "Error updating record",
                error: error.message
            });
        }
    }
);

// delete record
router.delete(
    "/:id",
    authMiddleware,
    authorizeRoles("admin"),
    async (req, res) => {
        try {
            const recordId = req.params.id;

            const deletedRecord = await Record.findByIdAndUpdate(
                recordId,
                { isDeleted: true },
                { new: true }
            );
            if (!deletedRecord) {
                return res.status(404).json({
                    message: "Record not found"
                });
            }

            res.status(200).json({
                message: "Record deleted successfully"
            });

        } catch (error) {
            res.status(500).json({
                message: "Error deleting record",
                error: error.message
            });
        }
    }
);

module.exports = router;