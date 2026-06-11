import { useEffect, useState, useCallback } from "react";
import "./checkeventinterface.css";

function CheckEventInterface({ userEmail, goback }) {

  const BASE_URL = "http://localhost:5000";

  const [events, setEvents] = useState([]);
  const [view, setView] = useState("all");

  // ONLY ONE CARD OPEN
  const [openCard, setOpenCard] = useState(null);

  const fetchEvents = useCallback(async () => {

    try {

      let url = `${BASE_URL}/api/events`;

      if (view === "created") {
        url = `${BASE_URL}/api/events/created/${userEmail}`;
      }

      else if (view === "registered") {
        url = `${BASE_URL}/api/events/registered/${userEmail}`;
      }

      const res = await fetch(url);

      if (!res.ok) {
        throw new Error("Failed to fetch events");
      }

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

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: userEmail,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      alert("Registered Successfully!");

      fetchEvents();

    } catch (err) {

      console.error(err);
      alert(err.message);

    }
  };

  return (

    <div className="check-container">

      {/* TOP BAR */}
      <div className="top-bar">

        {/* LEFT LOGO */}

        <div className="nav-logo">

          <h1>
            EVENT <span>MANAGER</span>
          </h1>

        </div>

        {/* RIGHT NAVIGATION */}

        <div className="nav-links">

          <button
            onClick={() => setView("all")}
          >
            ALL EVENTS
          </button>

          <button
            onClick={() => setView("created")}
          >
            MY EVENTS
          </button>

          <button
            onClick={() => setView("registered")}
          >
            REGISTERED
          </button>

          <button onClick={goback}>
            DASHBOARD
          </button>

          <button
            onClick={() =>
              window.location.reload()
            }
          >
            LOGOUT
          </button>

        </div>

      </div>
      

      {/* EVENT LIST */}

      <div className="event-list">

        {events.length === 0 ? (

          <p>No events found.</p>

        ) : (

          events.map((event, index) => (

            <div
              key={event._id || index}
              className="event-card"

              onClick={(e) => {

                e.stopPropagation();

                setOpenCard(
                  openCard === event._id
                    ? null
                    : event._id
                );

              }}
            >

              {/* IMAGE */}

              {event.poster && (

                <img
                  src={event.poster}
                  alt={event.title}
                />

              )}

              {/* TITLE */}

              <h3>{event.title}</h3>

              {/* SHORT DESCRIPTION */}

              <p className="short-desc">

                {event.description?.slice(0, 80)}...

              </p>

              {/* OPEN ONLY CLICKED CARD */}

              {openCard === event._id && (

                <div className="extra-info" onClick={(e) => e.stopPropagation()}>

                  <p>
                    <b>Description:</b> {event.description}
                  </p>

                  <p>
                    <b>Location:</b> {event.location}
                  </p>

                  <p>
                    <b>Organizer:</b> {event.email}
                  </p>

                  <p>
                    <b>Start:</b>{" "}
                    {new Date(event.startDate).toLocaleString()}
                  </p>

                  <p>
                    <b>End:</b>{" "}
                    {new Date(event.endDate).toLocaleString()}
                  </p>

                  {/* REGISTER BUTTON */}

                  <div
                    onClick={(e) => e.stopPropagation()}
                  >

                    <button
                      className="register-btn"
                      onClick={() => handleRegister(event._id)}
                      disabled={
                        event.registeredUsers?.includes(userEmail)
                      }
                    >

                      {event.registeredUsers?.includes(userEmail)
                        ? "Registered"
                        : "Register"}

                    </button>

                  </div>

                </div>

              )}

            </div>

          ))

        )}

      </div>

    </div>
  );
}

export default CheckEventInterface;