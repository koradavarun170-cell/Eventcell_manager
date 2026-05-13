import { useEffect, useState, useCallback } from "react";
import "./checkeventinterface.css";

function CheckEventInterface({ userEmail, goback }) {
  const BASE_URL = "https://eventcell-manager.onrender.com";

  const [events, setEvents] = useState([]);
  const [view, setView] = useState("all");

  // Fetch events based on view
  const fetchEvents = useCallback(async () => {
    try {
      let url = `${BASE_URL}/api/events`;

      if (view === "created") {
        url = `${BASE_URL}/api/events/created/${userEmail}`;
      } else if (view === "registered") {
        url = `${BASE_URL}/api/events/registered/${userEmail}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch events");

      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error(err);
      setEvents([]);
    }
  }, [view, userEmail]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleRegister = async (eventId) => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/events/markregistered/${eventId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: userEmail }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      alert("Registered successfully!");
      fetchEvents();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div className="check-container">
      <div className="head">
        <h2>College Events</h2>

        <div className="tabs">
          <button
            onClick={() => setView("all")}
            className={view === "all" ? "active" : ""}
          >
            All Events
          </button>

          <button
            onClick={() => setView("created")}
            className={view === "created" ? "active" : ""}
          >
            My Events
          </button>

          <button
            onClick={() => setView("registered")}
            className={view === "registered" ? "active" : ""}
          >
            Registered
          </button>
        </div>
      </div>

      <div className="event-list">
        {events.length === 0 ? (
          <p>No events found.</p>
        ) : (
          events.map((event) => (
            <div className="event-card" key={event._id}>
              {event.poster && (
                <img
                  src={event.poster}
                  alt={event.title}
                  className="event-poster"
                />
              )}

              <h3>{event.title}</h3>

              <p>
                <b>Start:</b> {new Date(event.startDate).toLocaleString()}
              </p>

              <p>
                <b>End:</b> {new Date(event.endDate).toLocaleString()}
              </p>

              <p>
                <b>Location:</b> {event.location}
              </p>

              <p>{event.description}</p>

              <label>
                <input
                  type="checkbox"
                  checked={event.registeredUsers?.includes(userEmail)}
                  onChange={() => handleRegister(event._id)}
                  disabled={event.registeredUsers?.includes(userEmail)}
                />{" "}
                Registered
              </label>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CheckEventInterface;