const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    // For login (like 101)
    username: {
      type: String,
      required: true,
      unique: true,
    },

    // Optional (can keep or remove)
    email: {
      type: String,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["admin", "tenant"],
      default: "tenant",
    },

    phone: {
      type: String,
    },

    age: {
      type: Number,
    },

    people_living: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);