import "./body.css";

import bg from "./bg.jpg";

import { useState } from "react";
import Header from "../Header/header";
import CreateEventInterface from "../createeventinterface/createeventinterface";
import CheckEventInterface from "../checkeventinterface/checkeventinterface";

function Body(props) {

  const { email } = props;

  const [isactive, setactive] = useState("");

  function handleswitch(action) {
    setactive(action);
  }

  function goback() {
    setactive("");
  }

  return (
  <>

    {/* HEADER ONLY FOR DASHBOARD + CREATE */}

  {!isactive && <Header />}

    {/* DASHBOARD PAGE */}

    {!isactive && (

      <div
        className="body-page"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed"
        }}
      >
 <div className="body-navbar">

    <div className="body-logo">

      <h1>
        EVENT <span>MANAGER</span>
      </h1>

    </div>

  </div>
        <div className="body-containery">

          {/* LEFT CARD */}

          <div className="left-panel">

            <div className="action-card">

              <div className="card-image-box">

                <img
                  src="https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop"
                  alt="Create Event"
                />

              </div>

              <div className="card-content">

                <h2>Create Events</h2>

                <p>
                  Organize workshops, technical
                  events, hackathons and cultural
                  programs professionally with
                  schedules, posters and seamless
                  registrations.
                </p>

                <button
                  onClick={() => handleswitch("create")}
                >
                  CREATE EVENT
                </button>

              </div>

            </div>

          </div>

          {/* RIGHT CARD */}

          <div className="right-panel">

            <div className="action-card">

              <div className="card-image-box">

                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop"
                  alt="Check Events"
                />

              </div>

              <div className="card-content">

                <h2>Explore Events</h2>

                <p>
                  Browse technical, workshop and
                  cultural events happening across
                  campus and register instantly
                  through the event dashboard.
                </p>

                <button
                  onClick={() => handleswitch("check")}
                >
                  CHECK EVENTS
                </button>

              </div>

            </div>

          </div>

        </div>

      </div>

    )}

    {/* CREATE EVENT PAGE */}

    {isactive === "create" && (

      <CreateEventInterface
        userEmail={email}
        goback={goback}
      />

    )}

    {/* CHECK EVENT PAGE */}

    {isactive === "check" && (

      <CheckEventInterface
        userEmail={email}
        goback={goback}
      />

    )}

  </>
);
}

export default Body;