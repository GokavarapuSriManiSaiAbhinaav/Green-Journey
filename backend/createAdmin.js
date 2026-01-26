const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const Admin = require('./models/Admin');

mongoose.connect(process.env.MONGO_URI);

async function createAdmin() {
  try {
    // Clear existing admins to allow username change
    await Admin.deleteMany({});
    console.log('Old admin(s) removed 🗑️');

    const hashed = await bcrypt.hash('abhi123', 10);
    await Admin.create({ username: 'abhi', password: hashed });
    console.log('Admin created ✅');
    process.exit();
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
}

createAdmin();
