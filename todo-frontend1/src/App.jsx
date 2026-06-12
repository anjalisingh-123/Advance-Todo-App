import React from 'react'
import axios from 'axios';
import {useState, useEffect, useCallback} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import Navbar from './components/Navbar';
import TaskForm from './components/TaskForm';
import SearchBar from './components/SearchBar';
import TaskList from './components/TaskList';
import Toast from './components/Toast';
import "./styles/App.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toasts, setToasts] = useState([]);
  
  // Initialize dark mode from localStorage or system preference
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Sync dark mode class with HTML document element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const handleToggleTheme = useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, []);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const fetchTasks = useCallback(async (showLoader = false) => {
    if (showLoader) setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/tasks`);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      addToast('Failed to load tasks', 'error');
    } finally {
      if (showLoader) setIsLoading(false);
    }
  }, [addToast]);

  const deleteTask = useCallback(async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/tasks/${id}`);
      addToast('Task deleted successfully', 'success');
      fetchTasks(false); // background fetch
    } catch (error) {
      console.error('Error deleting task:', error);
      addToast('Failed to delete task', 'error');
    }
  }, [addToast, fetchTasks]);

  const updateTask = useCallback(async (id, updatedFields) => {
    try {
      await axios.put(`${API_BASE_URL}/api/tasks/${id}`, updatedFields);
      
      // Determine toast message based on action
      if (updatedFields.completed !== undefined) {
        addToast(
          updatedFields.completed ? 'Task marked as completed' : 'Task marked as active',
          'success'
        );
      } else if (updatedFields.title !== undefined) {
        addToast('Task updated successfully', 'success');
      } else {
        addToast('Task updated', 'success');
      }
      
      fetchTasks(false); // background fetch
    } catch (error) {
      console.error('Error updating task:', error);
      addToast('Failed to update task', 'error');
    }
  }, [addToast, fetchTasks]);

  const toggleTask = useCallback(async (id, completed) => {
    updateTask(id, { completed: !completed });
  }, [updateTask]);

  useEffect(() => {
    fetchTasks(true); // show spinner on initial load
  }, [fetchTasks]);

  const handleTaskAdded = useCallback(() => {
    addToast('Task added successfully', 'success');
    fetchTasks(false);
  }, [addToast, fetchTasks]);

  const handleReorder = useCallback((newTasks) => {
    setTasks(newTasks);
  }, []);

  const filteredTasks = tasks.filter((task) =>
    task.title ? task.title.toLowerCase().includes(searchQuery.toLowerCase()) : false
  );

  // Compute Task statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="app-container">
      <Navbar isDarkMode={isDarkMode} onToggleTheme={handleToggleTheme} addToast={addToast} />
      
      <motion.div 
        className="app"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h1 className="heading">My Todo App</h1>
        <p className="subHeading">Stay organized! Stay productive!</p>
        
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
}

export default App;
