const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { Schema } = mongoose;
const dotenv = require("dotenv");
dotenv.config();

// Schemas
const userSchema = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
});

// Hash user password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const adminSchema = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

// Hash admin password before saving
adminSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const courseSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  imageLink: { type: String, required: true },
  creatorId: { type: Schema.Types.ObjectId, ref: "admin", required: true },
  published: { type: Boolean, default: true }, // Default to true
  content: { type: String }, // New field for course content
});

const purchaseSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "user", required: true },
  courseId: { type: Schema.Types.ObjectId, ref: "course", required: true },
});

// Models
const User = mongoose.model("user", userSchema);
const Admin = mongoose.model("admin", adminSchema);
const Course = mongoose.model("course", courseSchema);
const Purchase = mongoose.model("purchase", purchaseSchema);

module.exports = {
  User,
  Admin,
  Course,
  Purchase,
};
