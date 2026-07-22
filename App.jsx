import Navbar from "./components/navbar";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ExpenseTracker from "./pages/ExpenseTracker";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import About from "./pages/About";

// Temporary placeholder pages (we’ll build these later)
const Page = ({ title }) => (
  <h1 style={{ color: "white" }}>{title}</h1>
);

function App() {
  return (
    <>
      <Navbar />

      <div style={{ padding: "20px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tracker" element={<ExpenseTracker />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </>
  );
}

export default App;