import { useContext, useMemo, useState } from "react";
import { ExpenseContext } from "../context/ExpenseContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./profile.css";

function Profile() {
  const { user, updateUser, transactions } = useContext(ExpenseContext);

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [showAll, setShowAll] = useState(false);

  const avatar = user.name?.charAt(0).toUpperCase() || "U";

  const saveProfile = () => {
    updateUser({ name });
    setIsEditing(false);
  };

  // =========================
  // 💰 NET WORTH
  // =========================
  const netWorth = useMemo(() => {
    return transactions.reduce((acc, t) => acc + t.amount, 0);
  }, [transactions]);

  const income = transactions
    .filter((t) => t.amount > 0)
    .reduce((a, b) => a + b.amount, 0);

  const expense = transactions
    .filter((t) => t.amount < 0)
    .reduce((a, b) => a + Math.abs(b.amount), 0);

  const savingsRate = income === 0 ? 0 : (income - expense) / income;

  // =========================
  // 🧠 PERSONALITY SYSTEM
  // =========================
  const personality = useMemo(() => {
    if (savingsRate > 0.6) return "💎 Wealth Builder";
    if (savingsRate > 0.3) return "🧠 Smart Saver";
    if (savingsRate > 0.1) return "⚖️ Balanced Spender";
    return "⚠️ Overspender";
  }, [savingsRate]);

  // =========================
  // 📊 MONTHLY DATA
  // =========================
  const monthlyData = useMemo(() => {
    const map = {};

    transactions.forEach((t) => {
      const date = new Date(t.id || Date.now());
      const month = date.toLocaleString("default", { month: "short" });

      if (!map[month]) map[month] = 0;
      map[month] += t.amount;
    });

    return Object.keys(map).map((m) => ({
      month: m,
      value: map[m],
    }));
  }, [transactions]);

  // =========================
  // 🏆 DYNAMIC ACHIEVEMENTS
  // =========================
  const achievements = [
    { id: 1, title: "💰 First ₹1,000", target: 1000, type: "wealth" },
    { id: 2, title: "💰 ₹10,000 Net Worth", target: 10000, type: "wealth" },
    { id: 3, title: "💰 ₹25,000 Net Worth", target: 25000, type: "wealth" },
    { id: 4, title: "💰 ₹50,000 Net Worth", target: 50000, type: "wealth" },
    { id: 5, title: "💎 ₹1,00,000 Wealth", target: 100000, type: "wealth" },

    { id: 6, title: "📊 10 Transactions", target: 10, type: "tx" },
    { id: 7, title: "📊 25 Transactions", target: 25, type: "tx" },
    { id: 8, title: "📊 50 Transactions", target: 50, type: "tx" },
    { id: 9, title: "📊 100 Transactions", target: 100, type: "tx" },

    { id: 10, title: "🧠 Smart Saver Start", target: 0.6, type: "ratio" },
    { id: 11, title: "⚖️ Balanced Budget", target: 0.4, type: "ratio" },
    { id: 12, title: "💸 Expense Control", target: 0.2, type: "ratio" },

    { id: 13, title: "🏦 Budget Builder", target: 15000, type: "wealth" },
    { id: 14, title: "📈 Growth Stage", target: 30000, type: "wealth" },
    { id: 15, title: "👑 Wealth Master", target: 75000, type: "wealth" },
  ];

  const getProgress = (a) => {
    if (a.type === "wealth") {
      return Math.min((netWorth / a.target) * 100, 100);
    }

    if (a.type === "tx") {
      return Math.min((transactions.length / a.target) * 100, 100);
    }

    if (a.type === "ratio") {
      return Math.min(savingsRate / a.target * 100, 100);
    }

    return 0;
  };

  const unlocked = achievements.filter((a) => getProgress(a) >= 100);

  return (
    <div className="dashboard">

      {/* HEADER */}
      <div className="topbar">
        <div className="avatar">{avatar}</div>

        <div className="profile-info">
          {!isEditing ? (
            <h2>{user.name}</h2>
          ) : (
            <input value={name} onChange={(e) => setName(e.target.value)} />
          )}

          <button className="edit-btn" onClick={() => {
            isEditing ? saveProfile() : setIsEditing(true);
          }}>
            {isEditing ? "Save" : "Edit"}
          </button>
        </div>

        <div className="right-info">
          <div className="label">Net Worth</div>
          <div className="value">₹{netWorth}</div>

          <div className="label">Personality</div>
          <div className="value">{personality}</div>
        </div>
      </div>

      {/* ACHIEVEMENTS */}
      <div className="section">
        <div className="section-header">
          <h3>🏆 Achievements</h3>
          <button className="view-btn" onClick={() => setShowAll(true)}>
            View All
          </button>
        </div>

        <div className="grid">
          {unlocked.map((a) => (
            <div className="card" key={a.id}>
              <h4>{a.title}</h4>
              <div className="bar">
                <div className="fill" style={{ width: "100%" }} />
              </div>
              <p>100%</p>
            </div>
          ))}
        </div>
      </div>

      {/* MONTHLY GRAPH */}
      <div className="section">
        <h3>📈 Monthly Performance</h3>

        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={monthlyData}>
            <XAxis dataKey="month" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#00c6ff" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* MODAL - ALL ACHIEVEMENTS */}
      <AnimatePresence>
        {showAll && (
          <motion.div className="modal">
            <div className="modal-box">

              <div className="modal-header">
                <h3>All Achievements</h3>
                <button onClick={() => setShowAll(false)}>✕</button>
              </div>

              <div className="modal-scroll">
                {achievements.map((a) => {
                  const p = getProgress(a);

                  return (
                    <div className="modal-item" key={a.id}>
                      <span>{a.title}</span>

                      <div className="mini-bar">
                        <div
                          className="mini-fill"
                          style={{ width: `${p}%` }}
                        />
                      </div>

                      <span>{Math.floor(p)}%</span>
                    </div>
                  );
                })}
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default Profile;