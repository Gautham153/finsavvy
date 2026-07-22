import { useContext, useState } from "react";
import { ExpenseContext } from "../context/ExpenseContext";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import "./analytics.css";

function Analytics() {
  const { transactions } = useContext(ExpenseContext);
  const { budget, setBudget } = useContext(ExpenseContext);

  const expenses = transactions.filter((t) => t.amount < 0);
  const income = transactions.filter((t) => t.amount > 0);

  const totalIncome = income.reduce((a, t) => a + t.amount, 0);
  const totalExpense = Math.abs(expenses.reduce((a, t) => a + t.amount, 0));

  const budgetUsed =
    budget > 0 ? (totalExpense / budget) * 100 : 0;

  const budgetProgress = Math.min(Math.max(budgetUsed, 0), 100);

  // ✅ ADDED (same as home.jsx)
  const getProgressColor = () => {
    if (budgetUsed > 80) return "#ef4444";
    if (budgetUsed > 50) return "#f59e0b";
    return "#22c55e";
  };

  const categoryMap = {};
  expenses.forEach((t) => {
    categoryMap[t.category] =
      (categoryMap[t.category] || 0) + Math.abs(t.amount);
  });

  const pieData = Object.keys(categoryMap).map((key) => ({
    name: key,
    value: categoryMap[key],
  }));

  const barData = [
    { name: "Income", value: totalIncome },
    { name: "Expense", value: totalExpense },
  ];

  // =========================
  // 📈 DAILY TREND (UNCHANGED)
  // =========================
  const trendMap = {};
  transactions.forEach((t) => {
    const date = new Date(t.date).toLocaleDateString();

    if (!trendMap[date]) {
      trendMap[date] = { date, income: 0, expense: 0 };
    }

    if (t.amount > 0) trendMap[date].income += t.amount;
    else trendMap[date].expense += Math.abs(t.amount);
  });

  const lineData = Object.values(trendMap);

  // =========================
  // 📅 WEEKLY TREND (YOUR ORIGINAL GRAPH)
  // =========================
  const weekMap = {
    Sun: 0,
    Mon: 0,
    Tue: 0,
    Wed: 0,
    Thu: 0,
    Fri: 0,
    Sat: 0,
  };

  transactions.forEach((t) => {
    if (t.amount < 0) {
      const day = new Date(t.date).toLocaleString("default", {
        weekday: "short",
      });
      weekMap[day] += Math.abs(t.amount);
    }
  });

  const weeklyData = Object.keys(weekMap).map((day) => ({
    day,
    value: weekMap[day],
  }));

  // =========================
  // 🔥 ONLY CHANGE: WEEKLY INSIGHT TEXT
  // =========================
  let weeklyInsight = "Not enough data";

  if (weeklyData.length >= 2) {
    const values = weeklyData.map((d) => d.value);

    const last = values[values.length - 1];
    const prev = values[values.length - 2];

    if (prev > 0) {
      const diff = last - prev;
      const percent = Math.abs((diff / prev) * 100).toFixed(0);

      if (diff > 0) {
        weeklyInsight = `📈 Spending increased by ${percent}% compared to previous day`;
      } else if (diff < 0) {
        weeklyInsight = `📉 Spending decreased by ${percent}% compared to previous day`;
      } else {
        weeklyInsight = "➖ Spending remained stable";
      }
    }
  }

  // =========================
  // 📊 MONTHLY (UNCHANGED)
  // =========================
  const monthMap = {};
  transactions.forEach((t) => {
    const month = new Date(t.date).toLocaleString("default", {
      month: "short",
    });

    if (!monthMap[month]) {
      monthMap[month] = { month, income: 0, expense: 0 };
    }

    if (t.amount > 0) monthMap[month].income += t.amount;
    else monthMap[month].expense += Math.abs(t.amount);
  });

  const monthlyData = Object.values(monthMap);

  // =========================
  // 🔮 PREDICTION (UNCHANGED)
  // =========================
  const avgExpense =
    expenses.reduce((a, t) => a + Math.abs(t.amount), 0) /
    (expenses.length || 1);

  const predicted = Math.round(avgExpense * 30);

  // =========================
  // 🧠 INSIGHTS (UNCHANGED)
  // =========================
  const insights = [];

  const topCategory =
    pieData.length > 0
      ? pieData.reduce((a, b) => (a.value > b.value ? a : b)).name
      : "None";

  if (totalExpense > totalIncome && totalIncome !== 0) {
    insights.push("⚠️ Overspending detected");
  }

  if (totalIncome - totalExpense > 20000) {
    insights.push("🔥 Strong savings trend");
  }

  if (topCategory !== "None") {
    insights.push(`📊 Top category: ${topCategory}`);
  }

  if (lineData.length > 2) {
    const last = lineData[lineData.length - 1];
    const prev = lineData[lineData.length - 2];

    insights.push(
      last.expense > prev.expense
        ? "📈 Spending increasing"
        : "📉 Spending stable"
    );
  }

  if (insights.length === 0) {
    insights.push("💡 Add more data to unlock insights");
  }

  const COLORS = [
    "#6366f1",
    "#22c55e",
    "#ef4444",
    "#f59e0b",
    "#06b6d4",
    "#a855f7",
  ];

  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <h2>Analytics Dashboard</h2>
        <p>Track your spending, savings & financial health</p>
      </div>

      <div className="analytics-grid">

        {/* BUDGET */}
        <div className="card card-wide">
          <div className="card-title">Budget Tracker</div>

          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
          />

          <div className="progress-bar">
            <div
              className="progresss"
              style={{
                width: `${budgetProgress}%`,
                background: getProgressColor(), // ✅ ONLY CHANGE
              }}
            />
          </div>

          <div className="muted">{Math.round(budgetUsed)}% used</div>
          {budgetUsed > 100 && (
            <div className="warn">⚠️ Budget exceeded</div>
          )}
        </div>

        {/* WEEKLY TREND */}
        <div className="card card-wide">
          <div className="card-title">Weekly Spending Trend</div>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={weeklyData}>
              <XAxis dataKey="day" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#6366f1"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>

          <div className="muted">{weeklyInsight}</div>
        </div>

        {/* KPI */}
        <div className="kpi-row">
          <div className="card kpi">
            <div className="muted">Income</div>
            <div className="kpi-value green">₹{totalIncome}</div>
          </div>

          <div className="card kpi danger">
            <div className="muted">Expense</div>
            <div className="kpi-value red">₹{totalExpense}</div>
          </div>
        </div>

        {/* CHART ROW */}
        <div className="chart-row">
          <div className="card">
            <div className="card-title">Categories</div>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={pieData} dataKey="value" outerRadius={85}>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <div className="card-title">Income vs Expense</div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={barData}>
                <XAxis dataKey="name" stroke="#aaa" />
                <YAxis stroke="#aaa" />
                <Tooltip />
                <Bar dataKey="value" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* DAILY TREND */}
        <div className="card card-wide">
          <div className="card-title">Daily Trend</div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineData}>
              <XAxis dataKey="date" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip />
              <Line dataKey="income" stroke="#22c55e" strokeWidth={3} />
              <Line dataKey="expense" stroke="#ef4444" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* MONTHLY */}
        <div className="card card-wide">
          <div className="card-title">Monthly Overview</div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <XAxis dataKey="month" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip />
              <Bar dataKey="income" fill="#22c55e" />
              <Bar dataKey="expense" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* PREDICTION */}
        <div className="card">
          <div className="card-title">Prediction</div>
          <div className="big">₹{predicted}</div>
          <div className="muted">Expected next month spend</div>
        </div>

        {/* INSIGHTS */}
        <div className="card">
          <div className="card-title">Insights</div>
          {insights.map((i, idx) => (
            <div key={idx} className="insight">
              {i}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Analytics;