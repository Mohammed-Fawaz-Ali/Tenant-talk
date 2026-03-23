const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    image_url: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "resolved"],
      default: "pending",
    },
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ticket", ticketSchema);