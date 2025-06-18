const express = require("express");
const router = express.Router();
const Purchase = require("../models/purchase");
const Course = require("../models/course");
const { auth } = require("../middleware/auth");

// Purchase a course (fake payment)
router.post("/course/:courseId", auth, async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if already purchased
    const existingPurchase = await Purchase.findOne({ userId, courseId });
    if (existingPurchase) {
      return res.status(400).json({ message: "Course already purchased" });
    }

    // Create purchase record (fake payment)
    const purchase = new Purchase({
      userId,
      courseId,
      amount: course.price,
      paymentStatus: 'completed'
    });

    await purchase.save();

    // Add user to course enrolled students
    course.enrolledStudents.push(userId);
    await course.save();

    res.json({ 
      message: "Course purchased successfully!", 
      purchaseId: purchase._id 
    });
  } catch (error) {
    console.error("Purchase error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get user's purchased courses
router.get("/my-courses", auth, async (req, res) => {
  try {
    const userId = req.user._id;
    
    const purchases = await Purchase.find({ userId })
      .populate('courseId')
      .sort({ purchaseDate: -1 });

    res.json({ purchases });
  } catch (error) {
    console.error("Get purchases error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Check if user has purchased a specific course
router.get("/course/:courseId/access", auth, async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    const purchase = await Purchase.findOne({ userId, courseId });
    
    res.json({ 
      hasAccess: !!purchase,
      purchase: purchase 
    });
  } catch (error) {
    console.error("Check access error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router; 