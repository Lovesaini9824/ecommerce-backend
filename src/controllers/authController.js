// const bcrypt = require('bcryptjs');
// const User = require('../models/User');
// const generateToken = require('../utils/generateToken');

// const register = async (req, res) => {
//   const { name, email, password, phone } = req.body;
//   const userExists = await User.findOne({ email });
//   if (userExists) return res.status(400).json({ message: 'User exists' });

//   const salt = await bcrypt.genSalt(10);
//   const hashed = await bcrypt.hash(password, salt);

//   const user = await User.create({ name, email, password: hashed, phone });
//   res.status(201).json({
//     _id: user._id,
//     name: user.name,
//     email: user.email,
//     phone: user.phone,
//     token: generateToken(user._id),
//   });
// };

// const login = async (req, res) => {
//   const { email, password } = req.body;
//   const user = await User.findOne({ email });
//   if (user && (await bcrypt.compare(password, user.password))) {
//     res.json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       token: generateToken(user._id),
//     });
//   } else {
//     res.status(401).json({ message: 'Invalid credentials' });
//   }
// };




// module.exports = { register, login };


const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // ✅ MISSING IMPORT FIXED
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

/* ================= REGISTER ================= */
const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
    });

    res.status(201).json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      token: generateToken(user._id),
    });

  } catch (error) {
    console.error("REGISTER ERROR ❌", error);
    res.status(500).json({ message: 'Registration failed' });
  }
};

/* ================= LOGIN ================= */
const login = async (req, res) => {
  try {
    console.log("LOGIN API HIT");
    console.log("Request body:", req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    console.log("User found:", user ? "YES" : "NO");

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET not defined");
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role || "user"
      }
    });

  } catch (error) {
    console.error("LOGIN ERROR ❌", error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

module.exports = { register, login };
