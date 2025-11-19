import styles from "./ExpenseList.module.css";
import ExpenseItem from "./ExpenseItem";
import type { Expense } from "../types";

type ExpenseListProps = {
  expenses: Expense[];
};

export default function ExpenseList({ expenses }: ExpenseListProps) {
  if (expenses.length === 0) {
    return <p className={styles.empty}>No expenses yet!</p>;
  }

  return (
    <div className={styles.list}>
      {expenses.map((expense) => (
        <ExpenseItem key={expense.id} expense={expense} />
      ))}
    </div>
  );
}
