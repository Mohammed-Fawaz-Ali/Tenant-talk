const Transaction = require("../models/Transaction");
const Property = require("../models/Property");
const User = require("../models/User");
const Notification = require("../models/Notification");

// TENANT: Upload Payment
exports.createTransaction = async (req, res) => {
  try {
    const { amount, month } = req.body;

    // find tenant property
    const property = await Property.findOne({ tenant: req.user._id });

    if (!property) {
      return res.status(404).json({ message: "Property not assigned" });
    }

    const receipt_image = req.file ? req.file.path : null;

    const transaction = await Transaction.create({
      tenant: req.user._id,
      property: property._id,
      amount,
      month,
      receipt_image,
    });

    // Notify admin(s) about new payment upload
    const admins = await User.find({ role: "admin" });
    const notifPayload = admins.map((admin) => ({
      user: admin._id,
      message: `New payment uploaded by tenant ${req.user.id}: ${amount} for ${month}`,
      type: "payment",
    }));
    if (notifPayload.length > 0) {
      await Notification.insertMany(notifPayload);
    }

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// TENANT: View own payments
exports.getMyTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      tenant: req.user._id,
    }).populate("property", "unit_no");

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN: View all payments
exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate("tenant", "username")
      .populate("property", "unit_no");

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN: Verify payment
exports.verifyTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    transaction.is_verified = true;
    await transaction.save();

    // Notify tenant that payment is verified
    await Notification.create({
      user: transaction.tenant,
      message: `Your payment of ${transaction.amount} for ${transaction.month} is verified`,
      type: "payment",
    });

    res.json({ message: "Payment verified", transaction });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};