import React, { useState, memo } from 'react'
import axios from 'axios';
import "../styles/TaskForm.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const TaskForm = ({ onTaskAdded }) => {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  
  const addTask = async () => {
    if (!title.trim()) return;
    try {
      // Serialize priority and due date into title for backend compatibility
      const rawTitle = `${title.trim()} #${priority.toLowerCase()}${dueDate ? ` due:${dueDate}` : ''}`;
      await axios.post(`${API_BASE_URL}/api/tasks`, { title: rawTitle });
      
      // Reset form fields
      setTitle('');
      setPriority('Medium');
      setDueDate('');
      
      onTaskAdded(); // Notify parent component to refresh the task list
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  const isButtonDisabled = !title.trim();

  return (
    <div className="taskForm-container">
      <div className="taskForm-inputs-row">
        <input 
          className="taskInput taskForm-title"
          type="text" 
          placeholder="What needs to be done?" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        
        <select 
          className="taskSelect taskForm-priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="Low">🟢 Low</option>
          <option value="Medium">🟡 Medium</option>
          <option value="High">🔴 High</option>
        </select>
        
        <input 
          className="taskDate taskForm-date"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>
      
      <button 
        className="addBtn taskForm-submit" 
        onClick={addTask}
        disabled={isButtonDisabled}
      >
        Add Task
      </button>
    </div>
  );
}

export default memo(TaskForm);

