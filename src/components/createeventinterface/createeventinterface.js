import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function CreateEventInterface({ userEmail, goback }) {
  const [posterPreview, setPosterPreview] = useState("");
  const [posterBase64, setPosterBase64] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [organizers, setOrganizers] = useState([{ name: "", email: "", phone: "" }]);
  const [faculties, setFaculties] = useState([{ name: "", email: "" }]);
  const [message, setMessage] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
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
    Software: ["Web Development", "App Development", "AI/ML", "Coding", "Cybersecurity", "UI/UX Design"],
    Hardware: ["Robotics", "IoT", "Embedded Systems", "Circuit Design", "3D Printing"],
    "Non-Technical": ["Singing", "Dancing", "Painting", "Quiz", "Modeling", "Gaming"],
  };

  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handlePosterChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPosterPreview(reader.result);
        setPosterBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddOrganizer = () => setOrganizers([...organizers, { name: "", email: "", phone: "" }]);
  const handleAddFaculty = () => setFaculties([...faculties, { name: "", email: "" }]);

  const handleOrganizerChange = (index, field, value) => {
    const updated = [...organizers];
    updated[index][field] = value;
    setOrganizers(updated);
  };

  const handleFacultyChange = (index, field, value) => {
    const updated = [...faculties];
    updated[index][field] = value;
    setFaculties(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Filter empty organizers/faculties
    const filteredOrganizers = organizers.filter(o => o.name && o.email && o.phone);
    const filteredFaculties = faculties.filter(f => f.name && f.email);

    try {
      const eventData = {
        ...formData,
        category,
        subCategory,
        poster: posterBase64,
        organizers: filteredOrganizers,
        faculties: filteredFaculties,
        email : userEmail,
        createdAt: new Date().toISOString(),
        status: "Pending",
        minMembers: formData.participationType === "Team" ? Number(formData.minMembers) : undefined,
        maxMembers: formData.participationType === "Team" ? Number(formData.maxMembers) : undefined,
      };

      const res = await fetch("http://localhost:5000/api/addevent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Event creation failed");

      setMessage(true);

      setTimeout(() => {
        setMessage(false);
        setFormData({
          title: "",
          description: "",
          type: "",
          startDate: "",
          endDate: "",
          location: "",
          minMembers: "",
          maxMembers: "",
          registrationLink: "",
          registrationFee: "",
          participationType: "",
        });
        setPosterPreview("");
        setPosterBase64("");
        setOrganizers([{ name: "", email: "", phone: "" }]);
        setFaculties([{ name: "", email: "" }]);
        setCategory("");
        setSubCategory("");
        goback();
      }, 1500);
    } catch (err) {
      alert(err.message);
      console.error(err);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100" style={{ background: "linear-gradient(to right, #f2fcfe, #1c92d2)" }}>
      <div className="container bg-white p-4 rounded-4 shadow" style={{ maxWidth: "800px" }}>
        <h2 className="text-center text-primary mb-4">Create New Event</h2>
        <form onSubmit={handleSubmit}>
          {/* Event Title */}
          <div className="mb-3">
            <label className="form-label">Event Title</label>
            <input type="text" id="title" className="form-control" value={formData.title} onChange={handleInput} required />
          </div>

          {/* Description */}
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea id="description" className="form-control" rows="3" value={formData.description} onChange={handleInput} required></textarea>
          </div>

          {/* Poster */}
          <div className="mb-3">
            <label className="form-label">Upload Event Poster</label>
            <input type="file" className="form-control" accept="image/*" onChange={handlePosterChange} required />
            {posterPreview && <img src={posterPreview} alt="Poster Preview" className="w-100 mt-2 rounded-3 border p-2" style={{ maxHeight: "250px", objectFit: "contain" }} />}
          </div>

          {/* Category & Subcategory */}
          <div className="mb-3">
            <label className="form-label">Main Category</label>
            <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)} required>
              <option value="">Select Main Category</option>
              <option value="Software">Software</option>
              <option value="Hardware">Hardware</option>
              <option value="Non-Technical">Non-Technical</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Sub Category</label>
            <select className="form-select" value={subCategory} onChange={(e) => setSubCategory(e.target.value)} required>
              <option value="">Select Sub Category</option>
              {subCategories[category]?.map((sub) => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>

          {/* Event Type */}
          <div className="mb-3">
            <label className="form-label d-block">Event Type</label>
            {["Online", "Offline"].map((type) => (
              <div key={type} className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="eventType"
                  value={type}
                  checked={formData.type === type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  id={type}
                  required
                />
                <label className="form-check-label" htmlFor={type}>{type}</label>
              </div>
            ))}
          </div>

          {/* Date & Time */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Start Date & Time</label>
              <input type="datetime-local" id="startDate" className="form-control" value={formData.startDate} onChange={handleInput} required />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">End Date & Time</label>
              <input type="datetime-local" id="endDate" className="form-control" value={formData.endDate} onChange={handleInput} required />
            </div>
          </div>

          {/* Location */}
          <div className="mb-3">
            <label className="form-label">Location</label>
            <input type="text" id="location" className="form-control" value={formData.location} onChange={handleInput} required />
          </div>

          {/* Organizers */}
          <div className="mb-3">
            <label className="form-label">Organizer(s)</label>
            {organizers.map((org, i) => (
              <div key={i} className="mb-3 border rounded-3 p-3">
                <input type="text" placeholder="Organizer Name" className="form-control mb-2" value={org.name} onChange={(e) => handleOrganizerChange(i, "name", e.target.value)} required />
                <input type="email" placeholder="Organizer Email" className="form-control mb-2" value={org.email} onChange={(e) => handleOrganizerChange(i, "email", e.target.value)} required />
                <input type="tel" placeholder="Organizer Contact" className="form-control" value={org.phone} onChange={(e) => handleOrganizerChange(i, "phone", e.target.value)} required />
              </div>
            ))}
            <button type="button" className="btn btn-secondary" onClick={handleAddOrganizer}>+ Add Another Organizer</button>
          </div>

          {/* Faculties */}
          <div className="mb-3">
            <label className="form-label">Faculty Coordinator(s)</label>
            {faculties.map((fac, i) => (
              <div key={i} className="mb-3 border rounded-3 p-3">
                <input type="text" placeholder="Faculty Name" className="form-control mb-2" value={fac.name} onChange={(e) => handleFacultyChange(i, "name", e.target.value)} required />
                <input type="email" placeholder="Faculty Email" className="form-control" value={fac.email} onChange={(e) => handleFacultyChange(i, "email", e.target.value)} required />
              </div>
            ))}
            <button type="button" className="btn btn-secondary" onClick={handleAddFaculty}>+ Add Another Faculty</button>
          </div>

          {/* Participation */}
          <div className="mb-3">
            <label className="form-label d-block">Participation Type</label>
            {["Solo", "Team"].map((type) => (
              <div key={type} className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="participationType"
                  value={type}
                  checked={formData.participationType === type}
                  onChange={(e) => setFormData({ ...formData, participationType: e.target.value })}
                  id={type}
                  required
                />
                <label className="form-check-label" htmlFor={type}>{type}</label>
              </div>
            ))}
          </div>

          {formData.participationType === "Team" && (
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Minimum Members</label>
                <input type="number" id="minMembers" className="form-control" value={formData.minMembers} onChange={handleInput} required />
              </div>
              <div className="col-md-6">
                <label className="form-label">Maximum Members</label>
                <input type="number" id="maxMembers" className="form-control" value={formData.maxMembers} onChange={handleInput} required />
              </div>
            </div>
          )}

          {/* Registration */}
          <div className="mb-3">
            <label className="form-label">Registration Link</label>
            <input type="url" id="registrationLink" className="form-control" value={formData.registrationLink} onChange={handleInput} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Registration Fee (₹)</label>
            <input type="number" id="registrationFee" className="form-control" min="0" value={formData.registrationFee} onChange={handleInput} required />
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={!posterBase64}>Submit Event</button>
        </form>

        {message && <div className="alert alert-success mt-3 text-center">Event created successfully!</div>}
      </div>
    </div>
  );
}
