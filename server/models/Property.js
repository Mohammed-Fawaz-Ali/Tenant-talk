const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    unit_no: {
      type: String,
      required: true,
      unique: true,
    },
    rent_amount: {
      type: Number,
      required: true,
    },
    people_living: {
      type: Number,
      default: 1,
    },
    tenant_age: {
      type: Number,
      default: null,
    },
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    status: {
      type: String,
      enum: ["occupied", "vacant"],
      default: "vacant",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Property", propertySchema);