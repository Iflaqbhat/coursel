const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User, Purchase, Course } = require("../db"); // Import from db.js
const {
  signupSchema,
  signinSchema,
  profileSchema,
} = require("../validators/userSchema");
const { userAuth } = require("../middleware/usermiddleware");
const UserModel = require("../models/user");
const { auth } = require("../middleware/usermiddleware");

const JWT_SECRET = process.env.JWT_SECRET; // Use the same JWT secret

// User signup (public)
router.post("/signup", async (req, res) => {
  const parseResult = signupSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res
      .status(400)
      .json({ message: "Invalid input", errors: parseResult.error.errors });
  }

  const { email, password, firstName, lastName } = parseResult.data;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const newUser = await User.create({
      email,
      password,
      firstName,
      lastName,
      name: `${firstName} ${lastName}`.trim(), // Keep name for display if needed
    });

    res.json({ message: "User signup successful", userId: newUser._id });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// User signin (public)
router.post("/signin", async (req, res) => {
  const parseResult = signinSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res
      .status(400)
      .json({ message: "Invalid input", errors: parseResult.error.errors });
  }

  const { email, password } = parseResult.data;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ 
      message: "User signin successful", 
      token,
      userId: user._id,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: 'user'
      }
    });
  } catch (err) {
    console.error("Signin error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update user profile (protected)
router.put("/profile", userAuth, async (req, res) => {
  const result = profileSchema.safeParse(req.body);
  if (!result.success) {
    return res
      .status(400)
      .json({ message: "Invalid input", errors: result.error.errors });
  }

  try {
    const updateData = result.data;
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10); // Hash new password
    }

    // Only update provided fields
    const updateFields = {};
    if (updateData.email) updateFields.email = updateData.email;
    if (updateData.firstName) updateFields.firstName = updateData.firstName;
    if (updateData.lastName) updateFields.lastName = updateData.lastName;
    if (updateData.firstName || updateData.lastName) {
      updateFields.name = `${updateData.firstName || ''} ${updateData.lastName || ''}`.trim();
    }
    if (updateData.password) updateFields.password = updateData.password;

    const user = await User.findByIdAndUpdate(req.user._id, updateFields, {
      new: true,
      select: "-password", // Exclude password from response
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "Profile updated", user: {
      id: user._id,
      name: user.name,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: 'user',
      createdAt: user.createdAt
    }});
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get user purchases (protected)
router.get("/purchases", userAuth, async (req, res) => {
  try {
    const purchases = await Purchase.find({ userId: req.user._id }).populate(
      "courseId"
    );
    const courses = purchases.map((purchase) => {
      const c = purchase.courseId;
      if (!c) return null;
      return {
        _id: c._id,
        id: c._id,
        title: c.title,
        description: c.description,
        thumbnail: c.thumbnail || c.imageLink || '',
        imageLink: c.imageLink || c.thumbnail || '',
        category: c.category || '',
        level: c.level || '',
        duration: c.duration || '',
        videos: c.videos || [],
        price: c.price,
        published: c.published,
        creator: c.creatorId || '',
        enrolledStudents: c.enrolledStudents || [],
        rating: c.rating || 4.5,
        createdAt: c.createdAt,
      };
    }).filter(Boolean);
    res.json({ message: "Purchased courses", courses });
  } catch (err) {
    console.error("Fetch purchases error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Register a new user (alias for signup)
router.post("/register", async (req, res) => {
  const parseResult = signupSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res
      .status(400)
      .json({ message: "Invalid input", errors: parseResult.error.errors });
  }

  const { email, password, firstName, lastName } = parseResult.data;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const newUser = await User.create({
      email,
      password,
      firstName,
      lastName,
      name: `${firstName} ${lastName}`.trim(),
    });

    // Generate token
    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      message: "User registered successfully",
      token,
      userId: newUser._id,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: 'user'
      }
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get current user profile
router.get("/profile", userAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password");
    res.json(user);
  } catch (error) {
    console.error("Fetch profile error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
