import { useState } from "react";
import type { Task } from "../types/tasks";
import styles from "../styles/AddTask.module.css";

type AddTaskProps = {
  onAdd: (task: Task) => void;
};

export default function AddTask({ onAdd }: AddTaskProps) {
  const [title, setTitle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      status: "todo",
    };

    onAdd(newTask);
    setTitle("");
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Add new task..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className={styles.input}
      />
      <button className={styles.btn}>Add</button>
    </form>
  );
}
