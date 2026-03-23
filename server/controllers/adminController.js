const User = require("../models/User");
const Property = require("../models/Property");
const bcrypt = require("bcrypt");

// GET ALL TENANTS (Admin only)
exports.getTenants = async (req, res) => {
  try {
    const tenants = await User.find({ role: "tenant" }).select("-password");
    res.json(tenants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE TENANT DETAILS (Admin only)
exports.updateTenant = async (req, res) => {
  try {
    const { name, username, password, phone, age, people_living } = req.body;

    const user = await User.findById(req.params.id);
    if (!user || user.role !== "tenant") {
      return res.status(404).json({ message: "Tenant not found" });
    }

    if (username && username !== user.username) {
      const existing = await User.findOne({ username });
      if (existing) {
        return res.status(400).json({ message: "Username already taken" });
      }
      user.username = username;
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (age !== undefined) user.age = age;
    if (people_living !== undefined) user.people_living = people_living;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();
    res.json({ message: "Tenant updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE TENANT (Admin only)
exports.deleteTenant = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.role !== "tenant") {
      return res.status(404).json({ message: "Tenant not found" });
    }

    // Unassign this tenant from any property
    await Property.updateMany({ tenant: user._id }, { $set: { tenant: null, status: "vacant" } });

    await User.deleteOne({ _id: user._id });

    res.json({ message: "Tenant deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE TENANT PASSWORD (Admin only)
exports.updateTenantPassword = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const user = await User.findById(req.params.id);
    if (!user || user.role !== "tenant") {
      return res.status(404).json({ message: "Tenant not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE TENANT (Admin only)
exports.createTenant = async (req, res) => {
  try {
    const { name, username, password, phone } = req.body;

    if (!name || !username || !password) {
      return res.status(400).json({ message: "Name, username and password are required" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      username,
      password: hashedPassword,
      role: "tenant",
      phone,
    });

    res.status(201).json({
      message: "Tenant created successfully",
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};