const express = require("express");
const router = express.Router();
const { coursePurchaseSchema } = require("../validators/courseSchema");
const { userAuth, auth, isAdmin } = require("../middleware/usermiddleware");
const { Course, Purchase } = require("../db");
const jwt = require("jsonwebtoken");

// Get all courses (Public)
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("creatorId", "firstName lastName email")
      .select("-videos");
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Course preview (public, lists all published courses)
router.get("/preview", async (req, res) => {
  try {
    const courses = await Course.find({ published: true })
      .populate("creatorId", "username")
      .lean();
    res.json({
      message: "Available courses",
      courses: courses.map((course) => ({
        id: course._id,
        title: course.title,
        description: course.description,
        price: course.price,
        imageLink: course.imageLink || course.thumbnail,
        published: course.published,
        creator: course.creatorId?.username || "Unknown",
      })),
    });
  } catch (err) {
    console.error("Course preview error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get single course details (public)
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate courseId
    if (!id || id === 'undefined') {
      return res.status(400).json({ message: "Invalid course ID" });
    }
    
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    let userId = null;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id;
      } catch (err) {
        // Invalid token, continue without user
      }
    }

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if user has purchased the course
    let hasAccess = false;
    if (userId) {
      const purchase = await Purchase.findOne({ userId, courseId: id });
      hasAccess = !!purchase;
    }

    // Remove videos if user hasn't purchased
    const courseData = course.toObject();
    if (!hasAccess) {
      delete courseData.videos;
    }

    // Ensure imageLink is available (map from thumbnail if needed)
    if (!courseData.imageLink && courseData.thumbnail) {
      courseData.imageLink = courseData.thumbnail;
    }

    // Ensure both id and _id are present
    courseData.id = courseData._id.toString();
    courseData._id = courseData._id.toString();

    res.json({ 
      course: courseData,
      hasAccess
    });
  } catch (error) {
    console.error("Get course error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get course content (protected, requires purchase)
router.get("/:id/content", userAuth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    const purchase = await Purchase.findOne({
      userId: req.user._id,
      courseId: req.params.id,
    });
    if (!purchase) {
      return res
        .status(403)
        .json({ message: "You must purchase this course to view content" });
    }
    res.json({
      message: "Course content",
      content: course.content || "This is the course content (e.g., videos, lessons).",
    });
  } catch (err) {
    console.error("Fetch content error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Check purchase status (protected)
router.get("/:id/purchase", userAuth, async (req, res) => {
  try {
    const purchase = await Purchase.findOne({
      userId: req.user._id,
      courseId: req.params.id,
    });
    res.json({
      message: purchase ? "Course purchased" : "Course not purchased",
      purchased: !!purchase,
    });
  } catch (err) {
    console.error("Check purchase error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Create a new course (Admin only)
router.post("/", auth, isAdmin, async (req, res) => {
  try {
    const course = new Course({
      ...req.body,
      creatorId: req.user._id
    });
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add a video to a course (Admin only)
router.post("/:courseId/videos", auth, isAdmin, async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    
    // Set the order of the new video
    const newVideo = {
      ...req.body,
      order: course.videos.length + 1
    };
    
    course.videos.push(newVideo);
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a video in a course (Admin only)
router.put("/:courseId/videos/:videoId", auth, isAdmin, async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const videoIndex = course.videos.findIndex(
      video => video._id.toString() === req.params.videoId
    );

    if (videoIndex === -1) {
      return res.status(404).json({ message: "Video not found" });
    }

    course.videos[videoIndex] = {
      ...course.videos[videoIndex].toObject(),
      ...req.body
    };

    await course.save();
    res.json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a video from a course (Admin only)
router.delete("/:courseId/videos/:videoId", auth, isAdmin, async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    course.videos = course.videos.filter(
      video => video._id.toString() !== req.params.videoId
    );

    // Reorder remaining videos
    course.videos.forEach((video, index) => {
      video.order = index + 1;
    });

    await course.save();
    res.json({ message: "Video deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a course (Admin only)
router.put("/:id", auth, isAdmin, async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a course (Admin only)
router.delete("/:id", auth, isAdmin, async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
