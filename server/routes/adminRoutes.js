const express = require("express");
const router = express.Router();

const { createTenant } = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/roleMiddleware");

// Protected + Admin only
router.post("/create-tenant", protect, isAdmin, createTenant);

module.exports = router;