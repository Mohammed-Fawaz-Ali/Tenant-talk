const Ticket = require("../models/Ticket");
const User = require("../models/User");
const Notification = require("../models/Notification");

async function addNotification({ userId, message, type = "ticket" }) {
  return Notification.create({ user: userId, message, type });
}

// CREATE TICKET (Tenant)
exports.createTicket = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const { title, description } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }

    const image_url = req.file?.path ?? null;

    const ticket = await Ticket.create({
      title: title.trim(),
      description: description?.trim() ?? "",
      image_url,
      tenant: req.user._id,
    });

    // Notify admin(s)
    const tenant = await User.findById(req.user._id);
    const tenantLabel = tenant?.username || tenant?.name || "Tenant";

    const admins = await User.find({ role: "admin" });
    const notifications = admins.map((admin) => ({
      user: admin._id,
      message: `New ticket created by ${tenantLabel}: ${ticket.title}`,
      type: "ticket",
    }));
    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    res.status(201).json(ticket);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    console.error("createTicket error", error);
    next(error);
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

    // Notify ticket creator (tenant)
    const tenant = await User.findById(ticket.tenant);
    const tenantId = tenant?._id || ticket.tenant;

    await Notification.create({
      user: tenantId,
      message: `Your ticket "${ticket.title}" status changed to ${status}`,
      type: "ticket",
    });

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};