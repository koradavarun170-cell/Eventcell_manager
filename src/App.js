import "./App.css";
import { Routes, Route } from "react-router-dom";

import LoginPage from "./components/loginpage/loginpage";
import Body from "./components/body/body";
import CheckEventInterface from "./components/checkeventinterface/checkeventinterface";

function App() {
  return (
    <Routes>

      <Route path="/" element={<LoginPage />} />

      <Route path="/body" element={<Body />} />

      <Route
        path="/checkevents"
        element={<CheckEventInterface />}
      />

    </Routes>
  );
}

export default App;