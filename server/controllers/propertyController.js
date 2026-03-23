const Property = require("../models/Property");
const User = require("../models/User");

// CREATE PROPERTY (Admin)
exports.createProperty = async (req, res) => {
  try {
    const { unit_no, rent_amount } = req.body;

    const exists = await Property.findOne({ unit_no });
    if (exists) {
      return res.status(400).json({ message: "Unit already exists" });
    }

    const property = await Property.create({
      unit_no,
      rent_amount,
    });

    res.status(201).json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ASSIGN TENANT TO PROPERTY (Admin)
exports.assignTenant = async (req, res) => {
  try {
    const { tenantId } = req.body;

    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    const tenant = await User.findById(tenantId);
    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    property.tenant = tenant._id;
    property.status = "occupied";

    await property.save();

    res.json({ message: "Tenant assigned", property });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UNASSIGN TENANT FROM PROPERTY (Admin)
exports.unassignTenant = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    property.tenant = null;
    property.status = "vacant";

    await property.save();

    res.json({ message: "Tenant unassigned", property });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL PROPERTIES (Admin)
exports.getProperties = async (req, res) => {
  try {
    const properties = await Property.find().populate("tenant", "username name age");
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};