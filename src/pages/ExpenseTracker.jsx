import { useState, useContext } from "react";
import { ExpenseContext } from "../context/ExpenseContext";
import { motion } from "framer-motion";
import "./tracker.css";

function ExpenseTracker() {
  const { transactions, addTransaction, deleteTransaction, updateTransaction } =
    useContext(ExpenseContext);

  const [text, setText] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [type, setType] = useState("expense");
  const [editId, setEditId] = useState(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text || !amount) return;

    const newTransaction = {
      text,
      amount: type === "expense" ? -Math.abs(amount) : +Number(amount),
      category,
      date: new Date(),
    };

    if (editId) {
      updateTransaction(editId, newTransaction);
      setEditId(null);
    } else {
      addTransaction(newTransaction);
    }

    setText("");
    setAmount("");
  };

  const handleEdit = (t) => {
    setText(t.text);
    setAmount(Math.abs(t.amount));
    setCategory(t.category);
    setType(t.amount > 0 ? "income" : "expense");
    setEditId(t.id);
  };

  const filteredTransactions = transactions.filter((t) => {
    const matchSearch = t.text.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || t.category === filter;
    return matchSearch && matchFilter;
  });

  const amounts = transactions.map((t) => t.amount);
  const balance = amounts.reduce((a, b) => a + b, 0);
  const income = amounts.filter((a) => a > 0).reduce((a, b) => a + b, 0);
  const expense = Math.abs(
    amounts.filter((a) => a < 0).reduce((a, b) => a + b, 0)
  );

  const insights = [];

  if (transactions.length === 0) {
    insights.push("🚀 Start adding transactions!");
  }
  if (expense > income && income !== 0) {
    insights.push("⚠️ You're overspending!");
  }
  if (income > 0 && expense === 0) {
    insights.push("🔥 You're saving all your income!");
  }
  if (income - expense > 2000) {
    insights.push("💰 Strong savings! You can do better!");
  }

  const getEmoji = (cat) => {
    const map = {
      Food: "🍔",
      Travel: "🚗",
      Bills: "💡",
      Shopping: "🛍️",
      Salary: "💼",
      Freelance: "🧑‍💻",
      Investment: "📈",
      Health: "🏥",
      Education: "📚",
      Entertainment: "🎮",
    };
    return map[cat] || "💸";
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString();
  };

  return (
    <div className="tracker">
      <div className="tracker-header">
        <h2>Expense Tracker 💸</h2>
        <p>Manage your finances like a pro</p>
      </div>

      {/* INSIGHTS */}
      <div className="insight-box">
        {insights.map((i, index) => (
          <p key={index}>{i}</p>
        ))}
      </div>

      {/* FORM */}
      <form className="form-card" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Description"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option>Food</option>
          <option>Travel</option>
          <option>Bills</option>
          <option>Shopping</option>
          <option>Salary</option>
          <option>Freelance</option>
          <option>Investment</option>
          <option>Health</option>
          <option>Education</option>
          <option>Entertainment</option>
        </select>

        <div className="type-toggle">
          <button
            type="button"
            className={type === "income" ? "active green" : ""}
            onClick={() => setType("income")}
          >
            Income
          </button>
          <button
            type="button"
            className={type === "expense" ? "active red" : ""}
            onClick={() => setType("expense")}
          >
            Expense
          </button>
        </div>

        <button className="add-btn">
          {editId ? "Update Transaction" : "+ Add Transaction"}
        </button>
      </form>

      {/* SEARCH + FILTER */}
      <div className="controls">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option>All</option>
          <option>Food</option>
          <option>Travel</option>
          <option>Bills</option>
          <option>Shopping</option>
          <option>Salary</option>
          <option>Freelance</option>
          <option>Investment</option>
          <option>Health</option>
          <option>Education</option>
          <option>Entertainment</option>
        </select>
      </div>

      {/* SUMMARY */}
      <div className="summary">
        <div className="card">
          <p>Balance</p>
          <h3>₹{balance}</h3>
        </div>
        <div className="card green">
          <p>Income</p>
          <h3>₹{income}</h3>
        </div>
        <div className="card red">
          <p>Expense</p>
          <h3>₹{expense}</h3>
        </div>
      </div>

      {/* TRANSACTIONS */}
      <div className="list">
        <h3>Transactions</h3>

        {filteredTransactions.length === 0 ? (
          <div className="empty">
            <h3>💸 No transactions yet</h3>
            <p>Start tracking your money to see insights</p>
          </div>
        ) : (
          filteredTransactions.map((t) => (
            <motion.div key={t.id} className="item">
              <div className="left">
                <span>{getEmoji(t.category)}</span>
                <div>
                  <p>{t.text}</p>
                  <small>
                    {t.category} • {formatDate(t.date)}
                  </small>
                </div>
              </div>

              <div className="right">
                <span className={t.amount > 0 ? "plus" : "minus"}>
                  ₹{t.amount}
                </span>

                <button onClick={() => handleEdit(t)}>✏️</button>
                <button onClick={(e) => {
                    e.stopPropagation();
                    deleteTransaction(t.id);
                    }}>❌</button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

export default ExpenseTracker;