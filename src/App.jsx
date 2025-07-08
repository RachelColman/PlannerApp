import React, { useState } from "react";
import "./App.css"; // we'll add styles here later

const initialTasks = {
  daily: [],
  weekly: [],
};

export default function App() {
  const [tasks, setTasks] = useState(initialTasks);
  const [input, setInput] = useState("");
  const [type, setType] = useState("daily");

  const addTask = () => {
    if (!input.trim()) return;
    setTasks({
      ...tasks,
      [type]: [...tasks[type], { text: input, done: false }],
    });
    setInput("");
  };

  const toggleTask = (taskIndex, taskType) => {
    const updated = tasks[taskType].map((task, idx) =>
      idx === taskIndex ? { ...task, done: !task.done } : task
    );
    setTasks({ ...tasks, [taskType]: updated });
  };

  return (
    <div className="app-container">
      <h1>Planner App</h1>

      <div className="input-group">
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
        </select>
        <input
          type="text"
          value={input}
          placeholder="Enter task"
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={addTask}>Add</button>
      </div>

      {["daily", "weekly"].map((taskType) => (
        <div key={taskType} className="task-section">
          <h2>{taskType.charAt(0).toUpperCase() + taskType.slice(1)} Tasks</h2>
          <ul>
            {tasks[taskType].map((task, index) => (
              <li key={index} className="task-item">
                <span className="task-number">{index + 1}.</span>
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => toggleTask(index, taskType)}
                />
                <span className={task.done ? "done task-text" : "task-text"}>
                  {task.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

