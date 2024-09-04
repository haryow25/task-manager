import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaTrashAlt, FaCheckCircle, FaCircle } from "react-icons/fa";
import Swal from "sweetalert2";

function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const navigate = useNavigate();

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

  const addTask = async () => {
    if (newTask) {
      try {
        const response = await axios.post(
          "http://localhost:5000/tasks",
          { title: newTask, description: newDescription },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        // Update state with the new task
        setTasks([...tasks, response.data]);

        // Clear input fields
        setNewTask("");
        setNewDescription("");

        // Show success alert
        Swal.fire({
          icon: "success",
          title: "Task Added",
          text: "Your task has been added successfully!",
        });
      } catch (error) {
        console.error("Error adding task:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong while adding your task!",
        });
      }
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
    } catch (error) {
      console.error(
        "Error updating task:",
        error.response ? error.response.data : error.message
      );
    }
  };
  const deleteTask = async id => {
    // Show confirmation dialog
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    });

    // Proceed with deletion if confirmed
    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/tasks/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        // Remove the deleted task from state
        setTasks(tasks.filter(task => task.id !== id));

        // Show success alert
        Swal.fire("Deleted!", "Your task has been deleted.", "success");
      } catch (error) {
        console.error("Error deleting task:", error);

        // Show error alert
        Swal.fire(
          "Error!",
          "Something went wrong while deleting your task.",
          "error"
        );
      }
    }
  };

  const logOut = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <header className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-gray-800">Task Manager</h1>
        <button
          className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition"
          onClick={logOut}
        >
          Logout
        </button>
      </header>

      <div className="mb-6 flex flex-col space-y-4 border p-5 rounded shadow-lg">
        <input
          type="text"
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          placeholder="New task title"
          className="border border-gray-300 rounded-lg p-4 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
        />
        <textarea
          value={newDescription}
          onChange={e => setNewDescription(e.target.value)}
          placeholder="Task description"
          className="border border-gray-300 rounded-lg p-4 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
          rows="4"
        />
        <button
          onClick={addTask}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition duration-300 ease-in-out flex justify-center items-center space-x-2 shadow-lg "
        >
          <span>Add Task</span>
        </button>
      </div>

      <ul className="space-y-4">
        {tasks.map(task => (
          <li
            key={task.id}
            className="flex flex-col p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center">
              <button
                onClick={() => toggleTaskCompletion(task.id, !task.completed)}
                className="flex items-center justify-center w-6 h-6 rounded-full mr-4"
              >
                {task.completed ? (
                  <FaCheckCircle className="text-green-500" />
                ) : (
                  <FaCircle className="text-gray-400" />
                )}
              </button>
              <span
                className={`flex-1 ${
                  task.completed
                    ? "line-through text-gray-500"
                    : "text-gray-800"
                }`}
              >
                {task.title}
              </span>
              <button
                onClick={() => deleteTask(task.id)}
                className="ml-4 text-red-500 hover:text-red-600 transition"
              >
                <FaTrashAlt />
              </button>
            </div>
            <p className="mt-2 text-gray-600">{task.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskManager;
