import "./about.css";
import { motion } from "framer-motion";
import { useContext, useState } from "react";
import { ExpenseContext } from "../context/ExpenseContext";

function About() {
  const { transactions } = useContext(ExpenseContext);

  const total = transactions.reduce((a, t) => a + t.amount, 0);
  const count = transactions.length;

  // ✅ NEW (feedback state)
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleFeedback = () => {
    if (!feedback) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFeedback("");
    }, 2000);
  };

  return (
    <div className="about">

      {/* HEADER */}
      <div className="about-header">
        <h2>About FinSavvy</h2>
        <p>Control money. Build savings. Understand spending.</p>
      </div>

      {/* PURPOSE */}
      <motion.div className="about-card" whileHover={{ scale: 1.02 }}>
        <h3>💡 What is this?</h3>
        <p>
          A smart expense tracking application designed to help you manage
          income, control spending, and build better financial habits with
          powerful insights and clean analytics.
        </p>
      </motion.div>

      {/* FEATURES */}
      <motion.div className="about-card" whileHover={{ scale: 1.02 }}>
        <h3>🚀 Key Features</h3>
        <ul>
          <li>Track income & expenses</li>
          <li>Budget & savings goals</li>
          <li>Smart insights & predictions</li>
          <li>Analytics dashboard</li>
          <li>Custom categories</li>
          <li>Backup & restore data</li>
        </ul>
      </motion.div>

      {/* HOW IT WORKS */}
      <motion.div className="about-card" whileHover={{ scale: 1.02 }}>
        <h3>🧠 How it works</h3>
        <div className="steps">
          <div className="step">
            <span>1</span>
            <p>Add your transactions</p>
          </div>
          <div className="step">
            <span>2</span>
            <p>Track insights & analytics</p>
          </div>
          <div className="step">
            <span>3</span>
            <p>Improve your financial habits</p>
          </div>
        </div>
      </motion.div>

      {/* STATS */}
      <motion.div className="about-card" whileHover={{ scale: 1.02 }}>
        <h3>📊 Your Stats</h3>
        <div className="stats">
          <div className="stat">
            <h2>{count}</h2>
            <p>Transactions</p>
          </div>
          <div className="stat">
            <h2>₹{total}</h2>
            <p>Total Balance</p>
          </div>
        </div>
      </motion.div>

      {/* PRIVACY */}
      <motion.div className="about-card" whileHover={{ scale: 1.02 }}>
        <h3>🔐 Privacy</h3>
        <p>
          Your data is stored securely on your device using local storage.
          We do not collect, track, or share any personal information.
        </p>
      </motion.div>

      {/* TECH STACK */}
      <motion.div className="about-card" whileHover={{ scale: 1.02 }}>
        <h3>🛠 Tech Stack</h3>
        <div className="tech">
          <span>React</span>
          <span>Local Storage</span>
          <span>Recharts</span>
          <span>Framer Motion</span>
        </div>
      </motion.div>

      {/* FUTURE */}
      <motion.div className="about-card" whileHover={{ scale: 1.02 }}>
        <h3>🌟 What's Next</h3>
        <ul>
          <li>AI-powered insights</li>
          <li>Multi-device sync</li>
          <li>Receipt scanner</li>
          <li>Voice-based expense entry</li>
        </ul>
      </motion.div>

      {/* DEVELOPER */}
      <motion.div className="about-card" whileHover={{ scale: 1.02 }}>
        <h3>👨‍💻 Developer</h3>
        <p>
          Built by <strong>Gautham</strong>, Focused on building clean, smart and user-friendly applications.
        </p>
      </motion.div>

      {/* VERSION */}
      <motion.div className="about-card small" whileHover={{ scale: 1.02 }}>
        <h3>📦 Version</h3>
        <p>v1.0.0</p>
      </motion.div>

      {/* ========================= */}
      {/* ✅ FEEDBACK SECTION */}
      {/* ========================= */}
      <motion.div className="about-card" whileHover={{ scale: 1.02 }}>
        <h3>💬 Feedback</h3>

        <textarea
          placeholder="Write your feedback..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />

        <button className="about-btn" onClick={handleFeedback}>
          Submit Feedback
        </button>

        {submitted && <p className="success">✅ Feedback submitted!</p>}
      </motion.div>

      {/* ========================= */}
      {/* ✅ CONTACT SECTION */}
      {/* ========================= */}
      <motion.div className="about-card" whileHover={{ scale: 1.02 }}>
        <h3>📞 Contact Us</h3>

        <div className="contact">
          <p>📧 Email: support@FinSavvy.com</p>
          <p>📱 Phone: +91 98765 43210</p>
        </div>
      </motion.div>

    </div>
  );
}

export default About;