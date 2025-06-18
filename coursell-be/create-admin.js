const mongoose = require('mongoose');
const Admin = require('./models/admin');
require('dotenv').config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/coursell');
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: 'ifuubhat72@gmail.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user with your credentials
    const admin = new Admin({
      username: 'ifuubhat72@gmail.com',
      password: 'iflak@123'
    });

    await admin.save();
    console.log('Admin user created successfully!');
    console.log('Email: ifuubhat72@gmail.com');
    console.log('Password: iflak@123');

  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await mongoose.disconnect();
  }
}

createAdmin(); 