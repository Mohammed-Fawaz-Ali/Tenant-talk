const express = require("express");
const router = express.Router();

const {
  createTicket,
  getMyTickets,
  getAllTickets,
  updateTicketStatus,
} = require("../controllers/ticketController");

const { protect } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/roleMiddleware");

// Tenant
router.post("/", protect, createTicket);
router.get("/my", protect, getMyTickets);

// Admin
router.get("/", protect, isAdmin, getAllTickets);
router.put("/:id", protect, isAdmin, updateTicketStatus);

module.exports = router;