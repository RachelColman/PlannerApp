// server/index.js
import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";


const app = express();
const PORT = 4000;
// Recreate __filename and __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, "tasks.json");

app.use(cors());
app.use(express.json());

// Load tasks from file or initialize empty
let tasks = {};
if (fs.existsSync(DATA_FILE)) {
  tasks = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
} else {
  tasks = {
    Today: [],
    "This week": [],
    "Next week": [],
    "This month": [],
    Appointments: [],
  };
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
}

const saveTasks = () => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
};

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.send("PlannerApp API is running");
});
app.get("/tasks", (req, res) => {
    res.json(tasks);
  });
  

app.post("/tasks", (req, res) => {
  const { tab, text } = req.body;
  if (!tab || !text) return res.status(400).json({ error: "Missing tab or text" });
  const newTask = { id: uuidv4(), text, done: false };
  tasks[tab].push(newTask);
  saveTasks();
  res.status(201).json(newTask);
});

app.patch("/tasks/:tab/:id", (req, res) => {
  const { tab, id } = req.params;
  const taskList = tasks[tab];
  if (!taskList) return res.status(404).json({ error: "Tab not found" });
  const task = taskList.find((t) => t.id === id);
  if (!task) return res.status(404).json({ error: "Task not found" });
  task.done = !task.done;
  saveTasks();
  res.json(task);
});

app.delete("/tasks/:tab/:id", (req, res) => {
  const { tab, id } = req.params;
  const taskList = tasks[tab];
  if (!taskList) return res.status(404).json({ error: "Tab not found" });
  tasks[tab] = taskList.filter((t) => t.id !== id);
  saveTasks();
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
