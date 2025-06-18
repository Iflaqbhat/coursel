const mongoose = require('mongoose');
const Admin = require('./models/admin');
require('dotenv').config();

async function resetAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/coursell');
    console.log('Connected to MongoDB');

    // Drop the admins collection
    await mongoose.connection.db.dropCollection('admins');
    console.log('Dropped admins collection');

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
    console.error('Error resetting admin:', error);
  } finally {
    await mongoose.disconnect();
  }
}

resetAdmin(); 