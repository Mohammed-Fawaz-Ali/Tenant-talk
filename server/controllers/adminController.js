const User = require("../models/User");
const bcrypt = require("bcrypt");

// CREATE TENANT (Admin only)
exports.createTenant = async (req, res) => {
  try {
    const { name, username, password, phone } = req.body;

    // check existing user
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
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
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};