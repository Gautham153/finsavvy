import { createContext, useEffect, useState } from "react";

export const ExpenseContext = createContext();

export function ExpenseProvider({ children }) {

  // =========================
  // 💸 TRANSACTIONS
  // =========================
  const [transactions, setTransactions] = useState(() => {
    return JSON.parse(localStorage.getItem("transactions")) || [];
  });

  // =========================
  // 👤 USER
  // =========================
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || {
      name: "Gautham",
    };
  });

  // =========================
  // ⚙️ SETTINGS
  // =========================
  const [budget, setBudget] = useState(() => {
    return JSON.parse(localStorage.getItem("budget")) || 30000;
  });

  const [savingGoal, setSavingGoal] = useState(() => {
    return JSON.parse(localStorage.getItem("savingGoal")) || 30000;
  });

  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem("currency") || "₹";
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  const [categories, setCategories] = useState(() => {
    return (
      JSON.parse(localStorage.getItem("categories")) || [
        "Food","Travel","Bills","Shopping",
        "Salary","Freelance","Investment",
        "Health","Education","Entertainment"
      ]
    );
  });

  // =========================
  // 💾 STORAGE SYNC
  // =========================
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem("budget", budget);
  }, [budget]);

  useEffect(() => {
    localStorage.setItem("savingGoal", savingGoal);
  }, [savingGoal]);

  useEffect(() => {
    localStorage.setItem("currency", currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.body.className = theme; // 🔥 theme apply
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("categories", JSON.stringify(categories));
  }, [categories]);

  // =========================
  // TRANSACTION METHODS
  // =========================
  const addTransaction = (tx) => {
    const newTx = { ...tx, id: Date.now() };
    setTransactions((prev) => [...prev, newTx]);
  };

  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const updateTransaction = (id, updatedTx) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...updatedTx, id } : t))
    );
  };

  const updateUser = (data) => {
    setUser((prev) => ({ ...prev, ...data }));
  };

  return (
    <ExpenseContext.Provider
      value={{
        transactions,
        setTransactions,
        addTransaction,
        deleteTransaction,
        updateTransaction,

        user,
        updateUser,

        budget,
        setBudget,
        savingGoal,
        setSavingGoal,

        currency,
        setCurrency,

        theme,
        setTheme,

        categories,
        setCategories,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}