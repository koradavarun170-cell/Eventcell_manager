import Body from "../body/body";
import { useState } from "react";
import "./loginpage.css";

function LoginPage() {
  // FIX: Dynamic URL switching prevents production port timeout issues
  const BASE_URL = window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://eventcell-manager.onrender.com";

  const [tab, setTab] = useState("");
  const [panel, setPanel] = useState("signin");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [name, setName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const togglePanel = (panelName) => setPanel(panelName);

  // SIGNUP
  const handleSignup = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email: newEmail,
          password: newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Signup failed");

      alert("Signup successful 🎉");
      setTab("home");
    } catch (err) {
      alert(err.message);
    }
  };

  // SIGNIN
  const handleSignin = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Signin failed");

      alert("Login successful 🎉");
      setTab("home");
    } catch (err) {
      alert(err.message);
    }
  };

  if (tab === "home") {
    return <Body email={email || newEmail} />;
  }

  return (
    <div className="page-wrapper">
      {/* LOGO */}
      <div className="main-logo">
        <h1>
          EVENT <span>MANAGER</span>
        </h1>
      </div>

      <div className="center-wrapper">
        {/* LOGIN CARD */}
        <div className="body-container">
          <div className={`container ${panel === "signup" ? "right-panel-active" : ""}`}>
            
            {/* SIGN UP */}
            <div className="form-container sign-up-container">
              <form>
                <h1>Create account</h1>
                <p>Start organizing and managing events in minutes</p>
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button type="button" onClick={handleSignup}>
                  Sign Up
                </button>
              </form>
            </div>

            {/* SIGN IN */}
            <div className="form-container sign-in-container">
              <form>
                <h1>Welcome back</h1>
                <p>Continue where you left off</p>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="button" onClick={handleSignin}>
                  Get Started
                </button>
              </form>
            </div>

            {/* OVERLAY */}
            <div className="overlay-container">
              <div className="overlay">
                <div className="overlay-panel overlay-left">
                  <h1>Sign in</h1>
                  <p>Access your dashboard and manage events</p>
                  <button className="ghost" onClick={() => togglePanel("signin")}>
                    Sign In
                  </button>
                </div>
                <div className="overlay-panel overlay-right">
                  <h1>Get started</h1>
                  <p>Create your account and begin managing events</p>
                  <button className="ghost" onClick={() => togglePanel("signup")}>
                    Sign Up
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;