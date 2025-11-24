import AddTask from "./components/AddTask";
import { useState, useEffect } from "react";
//import { tasks as initialTasks } from "./data/task";
import Column from "./components/Column";
import type { Task } from "./types/tasks";
import styles from "./styles/App.module.css";
import { DragDropContext} from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";


function App() {
  const addTask = (task: Task) => {
  setTasks(prev => [task, ...prev]);
};

  const deleteTask = (id: string) => {
  setTasks(prev => prev.filter(task => task.id !== id));
};



  const [tasks, setTasks] = useState<Task[]>(() => {
  const saved = localStorage.getItem("tasks");
  return saved ? JSON.parse(saved) : [];
});

  useEffect(() => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}, [tasks]);



  const todo = tasks.filter(t => t.status === "todo");
  const inProgress = tasks.filter(t => t.status === "in-progress");
  const done = tasks.filter(t => t.status === "done");

  const handleDragEnd = (result: DropResult) => {
  const { destination, source } = result;
  if (!destination) return;

  setTasks((prev) => {
    const updated = Array.from(prev);
    const [moved] = updated.splice(source.index, 1);

    moved.status =
      destination.droppableId as "todo" | "in-progress" | "done";

    updated.splice(destination.index, 0, moved);

    return updated;
  });
};

  return (
  <div>
    <AddTask onAdd={addTask} />

    <DragDropContext onDragEnd={handleDragEnd}>
      <div className={styles.board}>
        <Column title="To Do" tasks={todo} status="todo" onDelete={deleteTask} />
        <Column title="In Progress" tasks={inProgress} status="in-progress" onDelete={deleteTask} />
        <Column title="Done" tasks={done} status="done" onDelete={deleteTask} />
      </div>
    </DragDropContext>
  </div>
);


  




}

export default App;

/*
return (
  <DragDropContext onDragEnd={handleDragEnd}>
    <div className={styles.board}>
      <Column title="To Do" tasks={todo} status="todo" />
      <Column title="In Progress" tasks={inProgress} status="in-progress" />
      <Column title="Done" tasks={done} status="done" />
    </div>
  </DragDropContext>
);
*/