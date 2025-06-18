const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Admin = require("../models/admin");
const Course = require("../models/course");
const {
  adminSignupSchema,
  adminSigninSchema,
  courseSchema,
} = require("../validators/adminSchema");
const { adminAuth } = require("../middleware/adminmiddleware");

const JWT_SECRET = process.env.JWT_SECRET;

// Admin signup (public)
router.post("/signup", async (req, res) => {
  const result = adminSignupSchema.safeParse(req.body);
  if (!result.success) {
    return res
      .status(400)
      .json({ message: "Invalid input", errors: result.error.errors });
  }

  const { username, password } = result.data;

  try {
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(409).json({ message: "Admin already exists" });
    }

    const newAdmin = await Admin.create({ username, password });
    res.json({ message: "Admin signup successful", adminId: newAdmin._id });
  } catch (err) {
    console.error("Admin signup error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Admin signin (public)
router.post("/signin", async (req, res) => {
  const result = adminSigninSchema.safeParse(req.body);
  if (!result.success) {
    return res
      .status(400)
      .json({ message: "Invalid input", errors: result.error.errors });
  }

  const { username, password } = result.data;

  try {
    const admin = await Admin.findOne({ username });
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: "2h" });
    res.json({ message: "Admin signin successful", token, adminId: admin._id });
  } catch (err) {
    console.error("Signin error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Create new course (protected)
router.post("/course", adminAuth, async (req, res) => {
  try {
    const { title, description, price, imageLink, published, category, level } = req.body;
    
    // Validate required fields
    if (!title || !description || !price || !imageLink) {
      return res.status(400).json({ 
        message: "Missing required fields: title, description, price, and imageLink are required" 
      });
    }

    const courseData = {
      title: title.trim(),
      description: description.trim(),
      price: Number(price),
      thumbnail: imageLink, // Map imageLink to thumbnail
      imageLink: imageLink, // Also keep imageLink for compatibility
      published: published ?? true,
      category: category || 'programming',
      level: level || 'beginner',
      creatorId: req.admin._id,
      videos: [], // Initialize empty videos array
      enrolledStudents: [], // Initialize empty students array
    };
    
    const newCourse = await Course.create(courseData);
    res.json({ message: "Course created", courseId: newCourse._id });
  } catch (err) {
    console.error("Course create error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Add videos to course (protected)
router.post("/course/:courseId/videos", adminAuth, async (req, res) => {
  try {
    const { courseId } = req.params;
    let { videos } = req.body;

    // Remove any _id field from videos so MongoDB generates its own
    videos = (videos || []).map(video => {
      const { _id, ...videoData } = video; // Destructure to remove _id
      return {
        title: videoData.title || '',
        description: videoData.description || '',
        videoUrl: videoData.videoUrl || '',
        duration: Number(videoData.duration) || 0,
        order: Number(videoData.order) || 1
      };
    });

    const course = await Course.findOne({ _id: courseId, creatorId: req.admin._id });
    if (!course) {
      return res.status(404).json({ message: "Course not found or unauthorized" });
    }

    course.videos = videos;
    await course.save();

    res.json({ message: "Videos added successfully", course });
  } catch (err) {
    console.error("Add videos error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get course with videos (admin only)
router.get("/course/:courseId/videos", adminAuth, async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const course = await Course.findOne({ _id: courseId, creatorId: req.admin._id });
    if (!course) {
      return res.status(404).json({ message: "Course not found or unauthorized" });
    }

    res.json({ course });
  } catch (err) {
    console.error("Get course videos error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Edit existing course (protected)
router.put("/course", adminAuth, async (req, res) => {
  const { courseId, ...updateData } = req.body;

  if (!courseId) {
    return res.status(400).json({ message: "Missing courseId" });
  }

  const result = courseSchema.safeParse(updateData);
  if (!result.success) {
    return res
      .status(400)
      .json({ message: "Invalid input", errors: result.error.errors });
  }

  try {
    const updatedCourse = await Course.findOneAndUpdate(
      { _id: courseId, creatorId: req.admin._id },
      result.data,
      { new: true }
    );
    if (!updatedCourse) {
      return res
        .status(404)
        .json({ message: "Course not found or unauthorized" });
    }

    res.json({ message: "Course updated", course: updatedCourse });
  } catch (err) {
    console.error("Course update error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete course (protected)
router.delete("/course/:id", adminAuth, async (req, res) => {
  try {
    const course = await Course.findOneAndDelete({
      _id: req.params.id,
      creatorId: req.admin._id,
    });
    if (!course) {
      return res
        .status(404)
        .json({ message: "Course not found or unauthorized" });
    }
    res.json({ message: "Course deleted" });
  } catch (err) {
    console.error("Delete course error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get admin's courses (protected)
router.get("/courses", adminAuth, async (req, res) => {
  try {
    const courses = await Course.find({ creatorId: req.admin._id });
    res.json({ 
      message: "Your courses", 
      courses: courses.map(course => {
        const courseObj = course.toObject();
        return {
          ...courseObj,
          id: courseObj._id.toString(),
          _id: courseObj._id.toString(),
          imageLink: courseObj.imageLink || courseObj.thumbnail || 'https://via.placeholder.com/400x200?text=Course+Image',
          category: courseObj.category || 'programming',
          level: courseObj.level || 'beginner',
          thumbnail: courseObj.thumbnail || courseObj.imageLink || 'https://via.placeholder.com/400x200?text=Course+Image'
        };
      }) 
    });
  } catch (err) {
    console.error("Fetch admin courses error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Bulk get courses (public)
router.get("/course/bulk", async (req, res) => {
  try {
    const courses = await Course.find({})
      .populate("creatorId", "firstName lastName email")
      .lean();
    res.json({
      message: "Courses fetched successfully",
      courses: courses.map((course) => ({
        title: course.title,
        description: course.description,
        price: course.price,
        imageLink: course.imageLink || course.thumbnail,
        published: course.published,
        category: course.category,
        level: course.level,
        creator: course.creatorId ? `${course.creatorId.firstName} ${course.creatorId.lastName}` : "Unknown",
        videos: course.videos,
        enrolledStudents: course.enrolledStudents,
        rating: course.rating,
        createdAt: course.createdAt,
        _id: course._id.toString()
      })),
    });
  } catch (err) {
    console.error("Fetch courses error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
