import Body from "../body/body";
import Header from "../Header/header";
import { useState } from "react";
import "./loginpage.css";

function LoginPage() {
  const BASE_URL = "https://eventcell-manager.onrender.com";

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
      console.error("Signup Error:", err.message);
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
      console.error("Signin Error:", err.message);
      alert(err.message);
    }
  };

  // HOME
  if (tab === "home") {
    return (
      <>
        <Header />
        <Body email={email || newEmail} />
      </>
    );
  }

  return (
    <div className="body-container">
      <div className={`container ${panel === "signup" ? "right-panel-active" : ""}`}>

        {/* SIGN UP */}
        <div className="form-container sign-up-container">
          <form>
            <h1>Create Account</h1>

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
            <h1>Sign In</h1>

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
              Sign In
            </button>
          </form>
        </div>

        {/* OVERLAY */}
        <div className="overlay-container">
          <div className="overlay">

            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>Login with your personal info</p>
              <button className="ghost" onClick={() => togglePanel("signin")}>
                Sign In
              </button>
            </div>

            <div className="overlay-panel overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your details and start your journey</p>
              <button className="ghost" onClick={() => togglePanel("signup")}>
                Sign Up
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default LoginPage;