// createeventinterface.js

import React, { useState, useEffect } from "react";
import axios from "axios"; 
import "bootstrap/dist/css/bootstrap.min.css";
import "./createeventinterface.css";

export default function CreateEventInterface({ userEmail, goback }) {

  const [posterPreview, setPosterPreview] = useState("");
  const [posterBase64, setPosterBase64] = useState("");

  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");

  const [message, setMessage] = useState(false);

  const [organizers, setOrganizers] = useState([
    {
      name: "",
      email: "",
      phone: "",
    },
  ]);

  const [faculties, setFaculties] = useState([
    {
      name: "",
      email: "",
    },
  ]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
    minMembers: "",
    maxMembers: "",
    registrationLink: "",
    registrationFee: "",
    participationType: "",
  });

  const subCategories = {

    Software: [
      "Web Development",
      "App Development",
      "AI/ML",
      "Coding",
    ],

    Hardware: [
      "Robotics",
      "IoT",
      "Embedded Systems",
    ],

    "Non-Technical": [
      "Singing",
      "Dancing",
      "Quiz",
    ],
  };

  /* =========================
      INPUT HANDLER
  ========================= */
  const handleInput = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* =========================
      RESET SUBCATEGORY
  ========================= */
  useEffect(() => {
    setSubCategory("");
  }, [category]);

  /* =========================
      POSTER HANDLER
  ========================= */
  const handlePosterChange = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {

      setPosterPreview(reader.result);

      setPosterBase64(reader.result);
    };

    reader.readAsDataURL(file);
  };

  /* =========================
      ORGANIZERS
  ========================= */
  const handleAddOrganizer = () => {

    setOrganizers([
      ...organizers,
      {
        name: "",
        email: "",
        phone: "",
      },
    ]);
  };

  const handleRemoveOrganizer = (index) => {

    if (organizers.length === 1) return;

    const updated = organizers.filter((_, i) => i !== index);

    setOrganizers(updated);
  };

  const handleOrganizerChange = (i, field, value) => {

    const updated = [...organizers];

    updated[i][field] = value;

    setOrganizers(updated);
  };

  /* =========================
      FACULTIES
  ========================= */
  const handleAddFaculty = () => {

    setFaculties([
      ...faculties,
      {
        name: "",
        email: "",
      },
    ]);
  };

  const handleRemoveFaculty = (index) => {

    if (faculties.length === 1) return;

    const updated = faculties.filter((_, i) => i !== index);

    setFaculties(updated);
  };

  const handleFacultyChange = (i, field, value) => {

    const updated = [...faculties];

    updated[i][field] = value;

    setFaculties(updated);
  };

 /* =========================
    SUBMIT
========================= */
const handleSubmit = async (e) => {

  e.preventDefault();

  // Filters out completely empty fields so your DB doesn't get flooded with empty rows
  const cleanOrganizers = organizers.filter(org => org.name.trim() !== "");
  const cleanFaculties = faculties.filter(fac => fac.name.trim() !== "");
const eventPayload = {
  ...formData,
  category,
  subCategory,
  organizers: cleanOrganizers,
  faculties: cleanFaculties,
  
  poster: posterBase64, 
    email: userEmail,
  participationType: formData.participationType, 
  type: "Offline" // Or bind this to an actual Online/Offline UI state field
};

  try {
    // Fire it right over to your port 5000 server backend with the /api prefix
    const response = await axios.post("https://eventcell-manager.onrender.com:5000/api/addevent", eventPayload);

    if (response.status === 200 || response.status === 201) {
      setMessage(true);

      setTimeout(() => {
        setMessage(false);
        goback();
      }, 1500);
    }
  } catch (error) {
    console.error("Axios Connection Error:", error);
    alert(error.response?.data?.message || "Cannot reach your backend server. Ensure node server.js is running!");
  }
};
  return (

    <div className="page">

      {/* MAIN CARD */}
      <div className="card">

        {/* HEADER */}
        <div className="header">

          {/* LEFT */}
          <div className="header-left">

            {/* BACK */}
            <button
              className="back-btn"
              onClick={goback}
              type="button"
            >
              ← Back
            </button>

            {/* LOGO */}
            <div className="logo">
              E
            </div>

          </div>

          {/* TITLE */}
          <h2>Create Event</h2>

          {/* EMPTY */}
          <div></div>

        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="form">

          {/* TITLE */}
          <div className="input-group-custom">

            <label>Event Title</label>

            <input
              type="text"
              name="title"
              placeholder="Enter event title"
              onChange={handleInput}
              required
            />

          </div>

          {/* DESCRIPTION */}
          <div className="input-group-custom">

            <label>Description</label>

            <textarea
              name="description"
              placeholder="Describe your event"
              onChange={handleInput}
              required
            />

          </div>

          {/* DATES */}
          <div className="double-grid">

            <div className="input-group-custom">

              <label>Start Date</label>

              <input
                type="datetime-local"
                name="startDate"
                onChange={handleInput}
                required
              />

            </div>

            <div className="input-group-custom">

              <label>End Date</label>

              <input
                type="datetime-local"
                name="endDate"
                onChange={handleInput}
                required
              />

            </div>

          </div>

          {/* CATEGORY */}
          <div className="double-grid">

            <div className="input-group-custom">

              <label>Category</label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >

                <option value="">
                  Select Category
                </option>

                <option>Software</option>
                <option>Hardware</option>
                <option>Non-Technical</option>

              </select>

            </div>

            <div className="input-group-custom">

              <label>Sub Category</label>

              <select
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                required
              >

                <option value="">
                  Select Subcategory
                </option>

                {subCategories[category]?.map((s) => (

                  <option key={s} value={s}>
                    {s}
                  </option>

                ))}

              </select>

            </div>

          </div>

          {/* LOCATION */}
          <div className="input-group-custom">

            <label>Location</label>

            <input
              type="text"
              name="location"
              placeholder="Enter location"
              onChange={handleInput}
              required
            />

          </div>

          {/* PARTICIPATION */}
          <div className="triple-grid">

            <div className="input-group-custom">

              <label>Participation</label>

              <select
                name="participationType"
                onChange={handleInput}
              >

                <option value="">
                  Select
                </option>

                <option value="Solo">Solo</option>
                <option value="Team">Team</option>

              </select>

            </div>

            <div className="input-group-custom">

              <label>Min Members</label>

              <input
                type="number"
                name="minMembers"
                placeholder="0"
                onChange={handleInput}
              />

            </div>

            <div className="input-group-custom">

              <label>Max Members</label>

              <input
                type="number"
                name="maxMembers"
                placeholder="0"
                onChange={handleInput}
              />

            </div>

          </div>

          {/* REGISTRATION */}
          <div className="double-grid">

            <div className="input-group-custom">

              <label>Registration Link</label>

              <input
                type="text"
                name="registrationLink"
                placeholder="Paste link"
                onChange={handleInput}
              />

            </div>

            <div className="input-group-custom">

              <label>Fee</label>

              <input
                type="number"
                name="registrationFee"
                placeholder="₹"
                onChange={handleInput}
              />

            </div>

          </div>

          {/* POSTER */}
          <div className="upload-box">

            <label className="upload-label">
              Upload Event Poster
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handlePosterChange}
            />

          </div>

          {/* IMAGE */}
          {posterPreview && (

            <img
              src={posterPreview}
              alt="poster"
              className="poster-image"
            />

          )}

          {/* ORGANIZERS */}
          <div className="section">

            <div className="section-header">

              <h4>Organizers</h4>

              <button
                type="button"
                className="mini-btn"
                onClick={handleAddOrganizer}
              >
                + Add Organizer
              </button>

            </div>

            {organizers.map((org, i) => (

              <div className="member-box" key={i}>

                <div className="member-top">

                  <span>
                    Organizer {i + 1}
                  </span>

                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => handleRemoveOrganizer(i)}
                  >
                    ✕
                  </button>

                </div>

                <input
                  type="text"
                  placeholder="Organizer Name"
                  value={org.name}
                  onChange={(e) =>
                    handleOrganizerChange(
                      i,
                      "name",
                      e.target.value
                    )
                  }
                />

                <input
                  type="email"
                  placeholder="Organizer Email"
                  value={org.email}
                  onChange={(e) =>
                    handleOrganizerChange(
                      i,
                      "email",
                      e.target.value
                    )
                  }
                />

                <input
                  type="text"
                  placeholder="Phone Number"
                  value={org.phone}
                  onChange={(e) =>
                    handleOrganizerChange(
                      i,
                      "phone",
                      e.target.value
                    )
                  }
                />

              </div>

            ))}

          </div>

          {/* FACULTIES */}
          <div className="section">

            <div className="section-header">

              <h4>Faculty Coordinators</h4>

              <button
                type="button"
                className="mini-btn"
                onClick={handleAddFaculty}
              >
                + Add Faculty
              </button>

            </div>

            {faculties.map((fac, i) => (

              <div className="member-box" key={i}>

                <div className="member-top">

                  <span>
                    Faculty {i + 1}
                  </span>

                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => handleRemoveFaculty(i)}
                  >
                    ✕
                  </button>

                </div>

                <input
                  type="text"
                  placeholder="Faculty Name"
                  value={fac.name}
                  onChange={(e) =>
                    handleFacultyChange(
                      i,
                      "name",
                      e.target.value
                    )
                  }
                />

                <input
                  type="email"
                  placeholder="Faculty Email"
                  value={fac.email}
                  onChange={(e) =>
                    handleFacultyChange(
                      i,
                      "email",
                      e.target.value
                    )
                  }
                />

              </div>

            ))}

          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            className="submit-btn"
          >
            Create Event
          </button>

        </form>

        {/* SUCCESS */}
        {message && (

          <div className="success">
            Event Created Successfully
          </div>

        )}

      </div>

    </div>
  );
}