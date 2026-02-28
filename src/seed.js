require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Admin = require("./modules/auth/admin.model");

const MONGO_URI = process.env.MONGO_URI;

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    const existing = await Admin.findOne({ email: "admin@quickhire.com" });
    if (existing) {
      console.log("Admin account already exists:");
      console.log("  Email: admin@quickhire.com");
      console.log("  (password unchanged)");
    } else {
      const hashed = await bcrypt.hash("Admin@123", 12);
      await Admin.collection.insertOne({
        email: "admin@quickhire.com",
        password: hashed,
      });
      console.log("Admin account created successfully!");
      console.log("  Email: admin@quickhire.com");
      console.log("  Password: Admin@123");
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err.message);
    process.exit(1);
  }
}

seed();
