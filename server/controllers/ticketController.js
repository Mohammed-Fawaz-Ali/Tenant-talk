const Ticket = require("../models/Ticket");

// CREATE TICKET (Tenant)
exports.createTicket = async (req, res) => {
  try {
    const { title, description } = req.body;

    const ticket = await Ticket.create({
      title,
      description,
      tenant: req.user._id,
    });

    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET MY TICKETS (Tenant)
exports.getMyTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ tenant: req.user._id });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL TICKETS (Admin)
exports.getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().populate("tenant", "username name");
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE STATUS (Admin)
exports.updateTicketStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    ticket.status = status;
    await ticket.save();

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};