const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const { getSummary, getCategories } = require("../controllers/dashboardController");

// get dashboard summary
router.get(
    "/summary",
    authMiddleware,
    authorizeRoles("admin", "analyst"),
    getSummary
);

// category-wise totals
router.get(
    "/categories",
    authMiddleware,
    authorizeRoles("admin", "analyst"),
    getCategories
);

module.exports = router;