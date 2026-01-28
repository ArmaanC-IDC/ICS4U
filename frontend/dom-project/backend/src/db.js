// db.js (ALL-IN-ONE SIMPLE USERS BACKEND)

import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import cors from "cors";

// -----------------------------
// CONFIG
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || "testdb";
const PORT = process.env.PORT || 3000;

// -----------------------------
// APP SETUP
const app = express();
app.use(express.json());
app.use(cors());


// -----------------------------
// DB CONNECT
async function connectToMongo() {
  await mongoose.connect(MONGODB_URI, { dbName: DB_NAME });
  console.log("Connected to MongoDB");
}

// -----------------------------
// USER MODEL
const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
  gender: String,
  phone: String,
  address: String,
  username: String,
  password: String
}, { timestamps: true });


const User = mongoose.model("User", userSchema);

// -----------------------------
// ROUTES

// GET ALL USERS
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// CREATE USER
app.post("/users", async (req, res) => {
  console.log(req.body);
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Could not create user" });
  }
});

// -----------------------------
// START SERVER
connectToMongo().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});