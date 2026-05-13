const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Eventy = require("../models/eventModel");

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    res.json({ message: "Signup Successful", user: newUser });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// Signin
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User Not Found" });

    if (user.password !== password)
      return res.status(400).json({ message: "Invalid Password" });

    res.json({ message: "Signin Successful", user });
  } catch (err) {
    console.error("Signin Error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// Add Event
router.post("/addevent", async (req, res) => {
  try {
    const newEvent = new Eventy(req.body);
    await newEvent.save();

    res.json({ message: "Event created successfully", event: newEvent });
  } catch (err) {
    console.error("Add Event Error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// Get all events
router.get("/events", async (req, res) => {
  try {
    const events = await Eventy.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    console.error("Fetch Events Error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// Created events
router.get("/events/created/:email", async (req, res) => {
  try {
    const events = await Eventy.find({ email: req.params.email }).sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    console.error("Fetch Created Events Error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// Registered events
router.get("/events/registered/:email", async (req, res) => {
  try {
    const events = await Eventy.find({
      registeredUsers: req.params.email,
    }).sort({ createdAt: -1 });

    res.json(events);
  } catch (err) {
    console.error("Fetch Registered Events Error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// Register for event
router.put("/events/markregistered/:eventId", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email)
      return res.status(400).json({ message: "Email is required" });

    const event = await Eventy.findById(req.params.eventId);
    if (!event)
      return res.status(404).json({ message: "Event not found" });

    if (event.registeredUsers?.includes(email)) {
      return res.status(400).json({
        message: "User already registered for this event",
      });
    }

    event.registeredUsers = event.registeredUsers || [];
    event.registeredUsers.push(email);

    await event.save();

    res.json({ message: "Successfully registered", event });
  } catch (err) {
    console.error("Mark Registered Error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

module.exports = router;