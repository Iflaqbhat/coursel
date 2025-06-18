const mongoose = require('mongoose');
const Admin = require('./models/admin');
require('dotenv').config();

// Admin schema
const adminSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

// Hash admin password before saving
adminSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const AdminModel = mongoose.model('admin', adminSchema);

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/coursell');
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: 'admin' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user
    const admin = new Admin({
      username: 'admin',
      password: 'admin123'
    });

    await admin.save();
    console.log('Admin user created successfully!');
    console.log('Username: admin');
    console.log('Password: admin123');

  } catch (error) {
    console.error('Error seeding admin:', error);
  } finally {
    await mongoose.disconnect();
  }
}

seedAdmin(); 