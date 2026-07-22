import { useContext, useState } from "react";
import { ExpenseContext } from "../context/ExpenseContext";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";
import "./home.css";

function Home() {
  const { transactions } = useContext(ExpenseContext);

const { budget, setBudget, savingGoal, setSavingGoal } = useContext(ExpenseContext);

  const amounts = transactions.map((t) => t.amount);

  const balance = amounts.reduce((a, b) => a + b, 0);
  const income = amounts.filter((a) => a > 0).reduce((a, b) => a + b, 0);
  const expense = amounts.filter((a) => a < 0).reduce((a, b) => a + b, 0);

  const totalExpense = Math.abs(expense);

  // ✅ CURRENT SAVINGS
  const currentSavings = income - totalExpense;

  // =========================
  // 📊 PIE DATA
  // =========================
  const expenses = transactions.filter((t) => t.amount < 0);

  const categoryMap = {};
  expenses.forEach((t) => {
    categoryMap[t.category] =
      (categoryMap[t.category] || 0) + Math.abs(t.amount);
  });

  const pieData = Object.keys(categoryMap).map((key) => ({
    name: key,
    value: categoryMap[key],
  }));

  // =========================
  // 📈 BAR DATA
  // =========================
  const barData = [
    { name: "Income", value: income },
    { name: "Expense", value: totalExpense },
  ];

  const COLORS = ["#6366f1", "#22c55e", "#ef4444", "#f59e0b"];

  // =========================
  // 🧠 SMART INSIGHT
  // =========================
  const getInsight = () => {
    if (transactions.length === 0) return "Start adding transactions 🚀";
    if (expense === 0) return "🔥 No expenses yet — perfect control!";
    if (expense > income) return "⚠️ You're overspending!";
    if (income - Math.abs(expense) > 20000)
      return "💰 Strong savings this month!";
    return "📊 You're managing money well!";
  };

  // =========================
  // 🚀 SMART BUDGET INSIGHT
  // =========================
  const daysPassed = new Date().getDate();
  const dailyAvg = totalExpense / (daysPassed || 1);
  const predicted = Math.round(dailyAvg * 30);

  const getBudgetInsight = () => {
    if (totalExpense === 0) return "No spending yet";
    if (predicted > budget)
      return `⚠️ You may exceed your budget by ₹${predicted - budget}`;
    return `✅ You are on track to save ₹${budget - predicted}`;
  };

  // =========================
  // 💰 SAVINGS PREDICTION
  // =========================
  const dailySaving = currentSavings / (daysPassed || 1);

  const getSavingDays = () => {
    if (currentSavings <= 0) return "⚠️ No savings trend yet";
    if (currentSavings >= savingGoal) return "🎉 Goal achieved!";
    if (dailySaving <= 0) return "⚠️ Saving rate too low";

    const daysNeeded = Math.ceil(
      (savingGoal - currentSavings) / dailySaving
    );

    return `📅 You may reach your goal in ${daysNeeded} days`;
  };

  // =========================
  // ⚠️ CATEGORY WARNING
  // =========================
  const getCategoryWarning = () => {
    if (pieData.length === 0) return "";

    const top = pieData.reduce((a, b) =>
      a.value > b.value ? a : b
    );

    const percent = Math.round((top.value / totalExpense) * 100);

    if (percent > 40)
      return `⚠️ ${percent}% of your spending is on ${top.name}`;

    return "";
  };

  return (
    <div className="home">
      {/* HEADER */}
      <div className="header">
        <div>
          <h2>Welcome back, Gautham👋</h2>
          <p>Track your money smarter</p>
        </div>
        <div className="avatar">G</div>
      </div>

      {/* CARDS */}
      <div className="cards">
        <motion.div className="card gradient" whileHover={{ scale: 1.05 }}>
          <h4>Total Balance</h4>
          <h2>₹{balance}</h2>
        </motion.div>

        <motion.div className="card income" whileHover={{ scale: 1.05 }}>
          <h4>Income</h4>
          <h2>₹{income}</h2>
        </motion.div>

        <motion.div className="card expense" whileHover={{ scale: 1.05 }}>
          <h4>Expense</h4>
          <h2>₹{Math.abs(expense)}</h2>
        </motion.div>
      </div>

      {/* 💰 BUDGET TRACKER */}
      <div className="budget-box">
        <h3>Budget Tracker</h3>

        <input
          type="number"
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
        />

        <div className="progress-bar">
          <div
            className="progresss"
            style={{
              width: `${Math.min((totalExpense / budget) * 100, 100)}%`,
              background:
                totalExpense / budget > 0.8
                  ? "#ef4444"
                  : totalExpense / budget > 0.5
                  ? "#f59e0b"
                  : "#22c55e",
            }}
          />
        </div>

        <p>{Math.round((totalExpense / budget) * 100)}% used</p>
      </div>

      {/* 💰 SAVINGS GOAL TRACKER */}
      <div className="saving-box">
        <h3>Savings Goal</h3>

        <input
          type="number"
          value={savingGoal}
          onChange={(e) => setSavingGoal(Number(e.target.value))}
        />

        <div className="progress-bar">
          <div
            className="progresss"
            style={{
              width: `${Math.min((currentSavings / savingGoal) * 100, 100)}%`,
              background:
                currentSavings / savingGoal > 0.8
                  ? "#22c55e"
                  : currentSavings / savingGoal > 0.5
                  ? "#f59e0b"
                  : "#ef4444",
            }}
          />
        </div>

        <p>
          {savingGoal === 0
            ? "0%"
            : Math.max(
                0,
                Math.round((currentSavings / savingGoal) * 100)
              )}
          % saved
        </p>

        <p className="saving-text">{getSavingDays()}</p>
      </div>

      {/* 🚀 SMART INSIGHT NEW */}
      <div className="smart-box">
        <p>{getBudgetInsight()}</p>
      </div>

      {/* ⚠️ CATEGORY WARNING */}
      {getCategoryWarning() && (
        <div className="warning-box">
          <p>{getCategoryWarning()}</p>
        </div>
      )}

      {/* 🧠 INSIGHT */}
      <div className="insight-box">
        <p>{getInsight()}</p>
      </div>

      {/* CHARTS */}
      <div className="chart-section">
        <motion.div className="chart" whileHover={{ scale: 1.02 }}>
          <h3>Spending Breakdown 📊</h3>

          <div className="chart-box">
            {transactions.length === 0 ? (
              "No data yet"
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" outerRadius={80}>
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        <motion.div className="chart" whileHover={{ scale: 1.02 }}>
          <h3>Income vs Expense 📈</h3>

          <div className="chart-box">
            {transactions.length === 0 ? (
              "No data yet"
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={barData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>
      </div>

      {/* TRANSACTIONS */}
      <div className="transactions">
        <h3>Recent Transactions</h3>

        {transactions.length === 0 ? (
          <p>No transactions yet</p>
        ) : (
          transactions
            .slice(-5)
            .reverse()
            .map((t, index) => (
              <motion.div
                key={t.id}
                className="tx"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <span>{t.text}</span>
                <span className={t.amount > 0 ? "plus" : "minus"}>
                  ₹{t.amount}
                </span>
              </motion.div>
            ))
        )}
      </div>
    </div>
  );
}

export default Home;