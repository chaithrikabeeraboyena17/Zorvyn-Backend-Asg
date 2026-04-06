const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const express = require("express");
const router = express.Router();

const { getRecords, createRecord, updateRecord, deleteRecord } = require("../controllers/recordController");

// get records with filters
router.get("/", getRecords);

// create record
router.post(
    "/",
    authMiddleware,
    authorizeRoles("admin"),
    createRecord
);

// update record
router.put(
    "/:id",
    authMiddleware,
    authorizeRoles("admin"),
    updateRecord
);

// delete record
router.delete(
    "/:id",
    authMiddleware,
    authorizeRoles("admin"),
    deleteRecord
);

module.exports = router;