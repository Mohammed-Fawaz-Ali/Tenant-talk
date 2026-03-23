const express = require("express");
const router = express.Router();

const {
  createTenant,
  getTenants,
  updateTenant,
  updateTenantPassword,
  deleteTenant,
} = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/roleMiddleware");

router.get("/tenants", protect, isAdmin, getTenants);
router.put("/tenant/:id", protect, isAdmin, updateTenant);
router.put("/tenant/:id/password", protect, isAdmin, updateTenantPassword);
router.delete("/tenant/:id", protect, isAdmin, deleteTenant);

// Protected + Admin only
router.post("/create-tenant", protect, isAdmin, createTenant);

module.exports = router;