const express = require("express");
const router = express.Router();

const {
  createTransaction,
  getMyTransactions,
  getAllTransactions,
  verifyTransaction,
} = require("../controllers/transactionController");

const { protect } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Tenant
router.post("/", protect, upload.single("receipt"), createTransaction);
router.get("/my", protect, getMyTransactions);

// Admin
router.get("/", protect, isAdmin, getAllTransactions);
router.put("/:id/verify", protect, isAdmin, verifyTransaction);

module.exports = router;