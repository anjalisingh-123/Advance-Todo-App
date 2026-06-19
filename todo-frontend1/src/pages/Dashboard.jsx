import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import Navbar from "../components/Navbar";
import TaskForm from "../components/TaskForm";
import SearchBar from "../components/SearchBar";
import TaskList from "../components/TaskList";
import Toast from "../components/Toast";
import "../styles/App.css";

const Dashboard = ({ isDarkMode, onToggleTheme }) => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Toast notifier helper
  const addToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Fetch all tasks from backend
  const fetchTasks = useCallback(async (showLoader = false) => {
    if (showLoader) setIsLoading(true);
    try {
      const response = await api.get("/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      addToast("Failed to load tasks", "error");
    } finally {
      if (showLoader) setIsLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTasks(true); // Initial load with loader
  }, [fetchTasks]);

  // Add Task callback
  const handleTaskAdded = useCallback(() => {
    addToast("Task added successfully", "success");
    fetchTasks(false); // Background fetch to avoid screen flashes
  }, [addToast, fetchTasks]);

  // Toggle Task Completion callback
  const toggleTask = useCallback(async (id, completed) => {
    try {
      await api.put(`/tasks/${id}`, { completed: !completed });
      addToast(
        !completed ? "Task marked as completed" : "Task marked as active",
        "success"
      );
      fetchTasks(false);
    } catch (error) {
      console.error("Error toggling task:", error);
      addToast("Failed to update task", "error");
    }
  }, [addToast, fetchTasks]);

  // Edit Task callback
  const updateTask = useCallback(async (id, updatedFields) => {
    try {
      await api.put(`/tasks/${id}`, updatedFields);
      addToast("Task updated successfully", "success");
      fetchTasks(false);
    } catch (error) {
      console.error("Error updating task:", error);
      addToast("Failed to update task", "error");
    }
  }, [addToast, fetchTasks]);

  // Delete Task callback
  const deleteTask = useCallback(async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      addToast("Task deleted successfully", "success");
      fetchTasks(false);
    } catch (error) {
      console.error("Error deleting task:", error);
      addToast("Failed to delete task", "error");
    }
  }, [addToast, fetchTasks]);

  // Local drag-and-drop state updates
  const handleReorder = useCallback((newTasks) => {
    setTasks(newTasks);
  }, []);

  // Filter tasks in real time by title
  const filteredTasks = tasks.filter((task) =>
    task.title ? task.title.toLowerCase().includes(searchQuery.toLowerCase()) : false
  );

  // Compute Task metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="app-container">
      <Navbar 
        isDarkMode={isDarkMode} 
        onToggleTheme={onToggleTheme} 
        addToast={addToast} 
        user={user}
        onLogout={logout}
      />
      
      <motion.div 
        className="app"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="welcome-banner" style={{ marginBottom: "1.5rem", textAlign: "left" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "var(--text-color)" }}>
            Welcome back, {user?.username}!
          </h2>
          <p style={{ fontSize: "0.9rem", color: "var(--secondary-text)" }}>
            Here is your productivity outline for today.
          </p>
        </div>

        <TaskForm onTaskAdded={handleTaskAdded} />
        
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        {totalTasks > 0 && (
          <div className="progress-card">
            <div className="progress-header">
              <span className="progress-title">Task Progress</span>
              <span className="progress-counter">
                {completedTasks} of {totalTasks} completed ({completionPercentage}%)
              </span>
            </div>
            <div className="progress-track">
              <motion.div 
                className="progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${completionPercentage}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>
          </div>
        )}
        
        {isLoading ? (
          <div className="loading-spinner-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Fetching tasks...</p>
          </div>
        ) : (
          <TaskList 
            tasks={filteredTasks} 
            onDelete={deleteTask} 
            onToggle={toggleTask} 
            onUpdate={updateTask} 
            onReorder={handleReorder}
            hasActiveTasks={tasks.length > 0}
          />
        )}
      </motion.div>

      <Toast toasts={toasts} onClose={removeToast} />
    </div>
  );
};

export default Dashboard;
