import styles from "./ExpenseItem.module.css";
import type { Expense } from "../types";

type ExpenseItemProps = {
  expense: Expense;
};

export default function ExpenseItem({ expense }: ExpenseItemProps) {
  return (
    <div className={styles.item}>
      <div>
        <h3>{expense.title}</h3>
        <p className={styles.date}>{expense.date}</p>
      </div>
      <p className={styles.amount}>${expense.amount.toFixed(2)}</p>
    </div>
  );
}
