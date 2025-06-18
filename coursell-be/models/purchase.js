const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'completed' // For fake payment
  },
  purchaseDate: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Ensure one user can only purchase a course once
purchaseSchema.index({ userId: 1, courseId: 1 }, { unique: true });

const Purchase = mongoose.model('Purchase', purchaseSchema);

module.exports = Purchase; 