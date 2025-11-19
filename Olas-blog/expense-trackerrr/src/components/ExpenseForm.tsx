import { useState } from "react";
import styles from "./ExpenseForm.module.css";
import type { Expense } from "../types";

type ExpenseFormProps = {
  onAddExpense: (expense: Expense) => void;
};

export default function ExpenseForm({ onAddExpense }: ExpenseFormProps) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newExpense: Expense = {
      id: Date.now(),
      title,
      amount: parseFloat(amount),
      date,
    };

    onAddExpense(newExpense);

    setTitle("");
    setAmount("");
    setDate("");
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <button type="submit">Add Expense</button>
    </form>
  );
}
