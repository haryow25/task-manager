import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  const fetchTasks = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(response.data);
    } catch (error) {
      console.error(
        "Error fetching tasks:",
        error.response ? error.response.data : error.message
      );
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = () => {
    if (newTask) {
      axios
        .post(
          "http://localhost:5000/tasks",
          { title: newTask },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then(response => {
          setTasks([...tasks, response.data]);
          setNewTask("");
          Swal.fire({
            icon: "success",
            title: "Task Added",
            text: "Your task has been added successfully!",
          });
        })
        .catch(error => console.error("Error adding task:", error));
    }
  };

  const toggleTaskCompletion = async (id, completed) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/tasks/${id}`,
        { completed },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setTasks(prevTasks =>
        prevTasks.map(task => (task.id === id ? response.data : task))
      );

      Swal.fire({
        icon: "success",
        title: "Task Updated",
        text: "Your task status has been updated!",
      });
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-6">Task Manager</h2>
        <div className="mb-6">
          <input
            type="text"
            value={newTask}
            onChange={e => setNewTask(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="New task"
          />
          <button
            onClick={addTask}
            className="w-full mt-2 p-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
          >
            Add Task
          </button>
        </div>
        <ul>
          {tasks.map(task => (
            <li
              key={task.id}
              className="flex items-center justify-between p-2 border-b border-gray-200"
            >
              <span
                className={task.completed ? "line-through text-gray-500" : ""}
              >
                {task.title}
              </span>
              <button
                onClick={() => toggleTaskCompletion(task.id, !task.completed)}
                className={`ml-2 p-2 rounded-lg ${
                  task.completed
                    ? "bg-green-500 text-white"
                    : "bg-blue-500 text-white"
                } hover:bg-opacity-80`}
              >
                {task.completed ? "Undo" : "Complete"}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TaskManager;
