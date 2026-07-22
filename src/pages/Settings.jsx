import { useContext, useState, useEffect } from "react";
import { ExpenseContext } from "../context/ExpenseContext";
import "./settings.css";

function Settings() {
  const {
    currency,
    setCurrency,
    theme,
    setTheme,
    categories,
    setCategories,
    transactions,
    setTransactions,
    budget,
    setBudget,
    savingGoal,
    setSavingGoal,
  } = useContext(ExpenseContext);

  const [newCategory, setNewCategory] = useState("");

  const defaultCategories = [
    "Food","Travel","Bills","Shopping","Salary",
    "Freelance","Investment","Health","Education","Entertainment",
  ];

  /* ✅ THEME APPLY FIX */
  useEffect(() => {
    document.body.classList.remove("dark", "light");

    if (theme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.add("light");
    }

    localStorage.setItem("theme", theme);
  }, [theme]);
  
  useEffect(() => {
  document.body.classList.remove("dark", "light");

  if (theme === "dark") {
    document.body.classList.add("dark");
  } else {
    document.body.classList.add("light");
  }

  localStorage.setItem("theme", theme);
}, [theme]);

  const addCategory = () => {
    if (!newCategory) return;
    setCategories([...categories, newCategory]);
    setNewCategory("");
  };

  const deleteCategory = (cat) => {
    setCategories(categories.filter((c) => c !== cat));
  };

  const resetCategories = () => {
    setCategories(defaultCategories);
  };

  const exportCSV = () => {
    const rows = [
      ["Text","Amount","Category","Date"],
      ...transactions.map((t) => [
        t.text,
        t.amount,
        t.category,
        new Date(t.date).toLocaleDateString(),
      ]),
    ];

    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "expenses.csv";
    link.click();
  };

  const clearData = () => {
    setTransactions([]);
  };

  return (
    <div className="settings">

      <h2>Settings ⚙️</h2>

      {/* 💰 Budget */}
      <div className="card">
        <h3>Budget</h3>
        <input
          type="number"
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
        />
      </div>

      {/* 💰 Savings */}
      <div className="card">
        <h3>Savings Goal</h3>
        <input
          type="number"
          value={savingGoal}
          onChange={(e) => setSavingGoal(Number(e.target.value))}
        />
      </div>

      {/* 💱 Currency */}
      <div className="card">
        <h3>Currency</h3>
        <select
          className="select"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
        >
          <option value="₹">₹ INR</option>
          <option value="$">$ USD</option>
          <option value="€">€ EUR</option>
        </select>
      </div>

      {/* 🌙 Theme */}
      <div className="card">
        <h3>Theme</h3>
        <div className="row">
          <button
            className={theme === "dark" ? "btn active" : "btn"}
            onClick={() => setTheme("dark")}
          >
            Dark
          </button>
          <button
            className={theme === "light" ? "btn active" : "btn"}
            onClick={() => setTheme("light")}
          >
            Light
          </button>
        </div>
      </div>

      {/* 📊 Categories */}
      <div className="card">
        <div className="card-header">
          <h3>Categories</h3>
          <button className="reset-btn" onClick={resetCategories}>
            Reset
          </button>
        </div>

        <div className="add-row">
          <input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New category"
          />
          <button className="btn" onClick={addCategory}>Add</button>
        </div>

        <div className="category-list">
          {categories.map((cat, i) => (
            <div key={i} className="category-item">
              <span>{cat}</span>
              <button
                className="delete-btn"
                onClick={() => deleteCategory(cat)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 📤 Export */}
      <div className="card">
        <h3>Export Data</h3>
        <button className="btn" onClick={exportCSV}>
          Download CSV
        </button>
      </div>

      {/* 🔁 RESET CYCLE */}
      <div className="box">
        <h3>Reset Cycle</h3>
        <div className="row">
          <span>Monthly Auto Reset</span>
          <button
            className={`toggle ${JSON.parse(localStorage.getItem("resetMonthly")) ? "active" : ""}`}
            onClick={() => {
              const current = JSON.parse(localStorage.getItem("resetMonthly")) || false;
              localStorage.setItem("resetMonthly", !current);
              window.location.reload();
            }}
          >
            {JSON.parse(localStorage.getItem("resetMonthly")) ? "ON" : "OFF"}
          </button>
        </div>
      </div>

      {/* 🎨 ACCENT COLOR */}
      <div className="box">
        <h3>Accent Color</h3>
        <div className="color-row">
          {["purple", "blue", "green"].map((c) => (
            <button
              key={c}
              className={`color-btn ${c}`}
              onClick={() => localStorage.setItem("accent", c)}
            />
          ))}
        </div>
      </div>

      {/* 💾 BACKUP / RESTORE */}
      <div className="box">
        <h3>Backup & Restore</h3>

        <div className="btn-row">
          <button
            onClick={() => {
              const data = localStorage.getItem("transactions");
              const blob = new Blob([data], { type: "application/json" });
              const url = URL.createObjectURL(blob);

              const a = document.createElement("a");
              a.href = url;
              a.download = "backup.json";
              a.click();
            }}
          >
            Backup
          </button>

          <label className="upload">
            Restore
            <input
              type="file"
              hidden
              onChange={(e) => {
                const file = e.target.files[0];
                const reader = new FileReader();

                reader.onload = (event) => {
                  setTransactions(JSON.parse(event.target.result));
                };

                reader.readAsText(file);
              }}
            />
          </label>
        </div>
      </div>

      {/* ⚠️ DATA PROTECTION */}
      <div className="box danger">
        <h3>Danger Zone</h3>

        <button
          className="danger-btn"
          onClick={() => {
            if (window.confirm("Are you sure?")) {
              setTransactions([]);
            }
          }}
        >
          Clear All Data
        </button>
      </div>

    </div>
  );
}

export default Settings;