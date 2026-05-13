
const mongoose = require("mongoose");

const organizerSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
});

const facultySchema = new mongoose.Schema({
  name: String,
  email: String,
});

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true }, // Online / Offline
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  location: { type: String, required: true },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  participationType: { type: String, required: true }, 
  minMembers: { type: Number },
  maxMembers: { type: Number },
  registrationLink: { type: String, required: true },
  registrationFee: { type: Number, required: true },
  poster: { type: String }, // Base64 string
  organizers: [organizerSchema],
  faculties: [facultySchema],
  email: { type: String, required: true }, 
  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now },
  registeredUsers: { type: [String], default: [] },
});

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;
