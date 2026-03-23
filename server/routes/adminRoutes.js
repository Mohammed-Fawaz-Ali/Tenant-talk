const express = require("express");
const router = express.Router();

const { createTenant } = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleWare");
const { isAdmin } = require("../middleware/roleMiddleWare");

// Protected + Admin only
router.post("/create-tenant", protect, isAdmin, createTenant);

module.exports = router;