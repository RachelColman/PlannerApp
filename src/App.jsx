import React, { useState, useEffect } from "react";
import "./App.css"; 
import logo from "./assets/logo.png";

function App() {
  const [tasks, setTasks] = useState({});
  const [newTaskText, setNewTaskText] = useState("");
  const [selectedTab, setSelectedTab] = useState("Today");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:4000/tasks")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch tasks");
        return res.json();
      })
      .then((data) => {
        setTasks(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const addTask = () => {
    if (!newTaskText.trim()) return;

    fetch("http://localhost:4000/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tab: selectedTab, text: newTaskText }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to add task");
        return res.json();
      })
      .then((newTask) => {
        setTasks((prev) => ({
          ...prev,
          [selectedTab]: [...(prev[selectedTab] || []), newTask],
        }));
        setNewTaskText("");
      })
      .catch((err) => setError(err.message));
  };

  const toggleTask = (tab, id) => {
    fetch(`http://localhost:4000/tasks/${tab}/${id}`, { method: "PATCH" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update task");
        return res.json();
      })
      .then((updatedTask) => {
        setTasks((prev) => ({
          ...prev,
          [tab]: prev[tab].map((t) => (t.id === id ? updatedTask : t)),
        }));
      })
      .catch((err) => setError(err.message));
  };

  const deleteTask = (tab, id) => {
    fetch(`http://localhost:4000/tasks/${tab}/${id}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete task");
        setTasks((prev) => ({
          ...prev,
          [tab]: prev[tab].filter((t) => t.id !== id),
        }));
      })
      .catch((err) => setError(err.message));
  };

  if (loading) return <div>Loading tasks...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-header">
          {/* Replace with your actual logo or remove img if none */}
          <img src={logo} alt="Logo" className="logo" />
          <div className="app-name">Personal Planner</div>
        </div>

        {Object.keys(tasks).map((tab) => (
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
        <div className="input-group">
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder={`Add task for ${selectedTab}`}
          />
          <button onClick={addTask}>Add Task</button>
        </div>

        <ul className="task-list">
          {(tasks[selectedTab] || []).map((task) => (
            <li key={task.id} className="task-item">
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => toggleTask(selectedTab, task.id)}
              />
              <span className={`task-text ${task.done ? "done" : ""}`}>
                {task.text}
              </span>
              <button
                className="delete-btn"
                onClick={() => deleteTask(selectedTab, task.id)}
                title="Delete Task"
              >
                &times;
              </button>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default App;
