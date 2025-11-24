import type { Task } from "../types/tasks";
import styles from "../styles/Column.module.css";
import { Droppable, Draggable } from "@hello-pangea/dnd";

type ColumnProps = {
  title: string;
  tasks: Task[];
  status: "todo" | "in-progress" | "done";
  onDelete: (id: string) => void;
};


export default function Column({ title, tasks, status, onDelete }: ColumnProps) {
  return (
    <div className={styles.column}>
      <h2 className={styles.title}>{title}</h2>

      <Droppable droppableId={status}>
        {(provided) => (
          <div
            className={styles.tasks}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided) => (
                  <div
                    className={styles.taskCard}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                     >
                    <span>{task.title}</span>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => onDelete(task.id)}
                    >
                      ✕
                    </button>
                  </div>

                )}
              </Draggable>
            ))}

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
