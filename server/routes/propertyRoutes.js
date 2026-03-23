const express = require("express");
const router = express.Router();

const {
  createProperty,
  assignTenant,
  unassignTenant,
  getProperties,
} = require("../controllers/propertyController");

const { protect } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/roleMiddleware");

// Admin only
router.post("/", protect, isAdmin, createProperty);
router.put("/:id/assign", protect, isAdmin, assignTenant);
router.put("/:id/unassign", protect, isAdmin, unassignTenant);
router.get("/", protect, isAdmin, getProperties);

module.exports = router;