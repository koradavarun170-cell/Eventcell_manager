const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Eventy = require("../models/eventModel"); // your event model

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
    const eventData = req.body; 
    const newEvent = new Eventy(eventData);
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


router.get("/events/created/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const events = await Eventy.find({ email }).sort({ createdAt: -1 });
    res.json(events);
  } catch (err) { 
    console.error("Fetch Created Events Error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});


router.get("/events/registered/:email", async (req, res) => {
  try {
    const { email } = req.params;
    // Assuming your Event model has a 'registeredUsers' array of emails
    const events = await Eventy.find({ registeredUsers: email }).sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    console.error("Fetch Registered Events Error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});
router.put("/events/markregistered/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;
    const { email } = req.body; // user email should come in request body

    if (!email) return res.status(400).json({ message: "Email is required" });

    // Find the event by ID
    const event = await Eventy.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Check if user is already registered
    if (event.registeredUsers && event.registeredUsers.includes(email)) {
      return res.status(400).json({ message: "User already registered for this event" });
    }

    // Add user email to registeredUsers array
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
