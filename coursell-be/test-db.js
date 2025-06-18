const mongoose = require('mongoose');
require('dotenv').config();

async function testDB() {
  try {
    await mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/coursell');
    console.log('Connected to MongoDB');

    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));

    // Check if admins collection exists and its schema
    const adminCollection = mongoose.connection.db.collection('admins');
    const adminCount = await adminCollection.countDocuments();
    console.log('Admin documents count:', adminCount);

    if (adminCount > 0) {
      const adminDoc = await adminCollection.findOne();
      console.log('Sample admin document:', adminDoc);
    }

  } catch (error) {
    console.error('Error testing DB:', error);
  } finally {
    await mongoose.disconnect();
  }
}

testDB(); 