import React, { useState, useEffect } from "react";
import "./App.css";
import logo from "./assets/logo.png"; // Make sure logo.png exists in src/assets/

const tabs = ["Today", "This week", "Next week", "Week after", "Appointments"];

export default function App() {
  // ✅ Load tasks from localStorage or default
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("planner-tasks");
    return saved ? JSON.parse(saved) : {
      Today: [],
      "This week": [],
      "Next week": [],
      "Week after": [],
      Appointments: [],
    };
  });

  const [selectedTab, setSelectedTab] = useState("Today");
  const [input, setInput] = useState("");

  // ✅ Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("planner-tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!input.trim()) return;
    setTasks({
      ...tasks,
      [selectedTab]: [...tasks[selectedTab], { text: input, done: false }],
    });
    setInput("");
  };

  const toggleTask = (index) => {
    const updated = tasks[selectedTab].map((task, i) =>
      i === index ? { ...task, done: !task.done } : task
    );
    setTasks({ ...tasks, [selectedTab]: updated });
  };

  const deleteTask = (index) => {
    const updated = tasks[selectedTab].filter((_, i) => i !== index);
    setTasks({ ...tasks, [selectedTab]: updated });
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-header">
          <img src={logo} alt="Logo" className="logo" />
          <h2 className="app-name">Personal Planner</h2>
        </div>
        {tabs.map((tab) => (
          <div
            key={tab}
            className={`tab ${selectedTab === tab ? "active" : ""}`}
            onClick={() => setSelectedTab(tab)}
          >
            {tab}
          </div>
        ))}
      </aside>

      <main className="main">
        <h2>{selectedTab}</h2>

        <div className="input-group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Add task for ${selectedTab.toLowerCase()}`}
          />
          <button onClick={addTask}>Add</button>
        </div>

        <ul className="task-list">
          {tasks[selectedTab].map((task, index) => (
            <li key={index} className="task-item">
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => toggleTask(index)}
              />
              <span className={`task-text ${task.done ? "done" : ""}`}>
                {index + 1}. {task.text}
              </span>
              <button className="delete-btn" onClick={() => deleteTask(index)}>
              🗑
              </button>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
