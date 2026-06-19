import { useState } from 'react';
import { FaCalendarAlt, FaTrash, FaPencilAlt, FaCheck, FaTimes } from 'react-icons/fa';
import '../styles/TaskCard.css';

const parseTaskTitle = (rawTitle, createdAt) => {
  let title = rawTitle || "";
  let priority = "Medium";
  let dueDate;

  // 1. Parse priority: #high, #medium, #low (case-insensitive)
  const priorityRegex = /#\b(high|medium|low)\b/i;
  const priorityMatch = title.match(priorityRegex);
  if (priorityMatch) {
    priority = priorityMatch[1].toLowerCase();
    priority = priority.charAt(0).toUpperCase() + priority.slice(1); // Capitalize
    title = title.replace(priorityRegex, "");
  }

  // 2. Parse due date: due:YYYY-MM-DD or @YYYY-MM-DD
  const dueRegex = /(?:due:|@)(\d{4}-\d{2}-\d{2})/i;
  const dueMatch = title.match(dueRegex);
  if (dueMatch) {
    const parts = dueMatch[1].split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // 0-indexed month
    const day = parseInt(parts[2], 10);
    dueDate = new Date(year, month, day);
    title = title.replace(dueRegex, "");
  } else {
    // Fallback: Default due date to 3 days after creation or 3 days from now
    const baseDate = createdAt ? new Date(createdAt) : new Date();
    dueDate = new Date(baseDate.getTime() + 3 * 24 * 60 * 60 * 1000);
  }

  // Clean extra spaces
  title = title.replace(/\s+/g, ' ').trim();

  return { title, priority, dueDate };
};

const formatDate = (date) => {
  if (!date || isNaN(date.getTime())) return "";
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const TaskCard = ({ task, onToggle, onDelete, onUpdate }) => {
  const { title, priority, dueDate } = parseTaskTitle(task.title, task.createdAt);
  const formattedDate = formatDate(dueDate);
  
  const [isEditing, setIsEditing] = useState(false);
  
  // Structured edit states
  const [editTitle, setEditTitle] = useState(title);
  const [editPriority, setEditPriority] = useState(priority);
  const [editDueDate, setEditDueDate] = useState(() => {
    if (!dueDate || isNaN(dueDate.getTime())) return "";
    return dueDate.toISOString().split('T')[0];
  });

  // Set time of due date to end of day for overdue calculation
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isOverdue = !task.completed && dueDate && new Date(dueDate).setHours(23, 59, 59, 999) < today.getTime();

  const handleEditStart = () => {
    const parsed = parseTaskTitle(task.title, task.createdAt);
    setEditTitle(parsed.title);
    setEditPriority(parsed.priority);
    setEditDueDate(
      parsed.dueDate && !isNaN(parsed.dueDate.getTime()) 
        ? parsed.dueDate.toISOString().split('T')[0] 
        : ""
    );
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editTitle.trim()) {
      // Re-serialize fields back into the title string format
      const rawTitle = `${editTitle.trim()} #${editPriority.toLowerCase()}${editDueDate ? ` due:${editDueDate}` : ''}`;
      if (rawTitle !== task.title) {
        onUpdate(task._id, { title: rawTitle });
      }
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  // Get Priority Badge Emoji Dot
  const getPriorityBadge = (p) => {
    switch (p.toLowerCase()) {
      case 'high': return 'High';
      case 'low': return 'Low';
      default: return 'Medium';
    }
  };

  return (
    <div className={`task-card ${task.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''} ${isEditing ? 'editing' : ''}`}>
      <div className="task-card-left">
        {!isEditing && (
          <input
            type="checkbox"
            className="task-card-checkbox"
            checked={task.completed}
            onChange={() => onToggle(task._id, task.completed)}
            onDragStart={(e) => e.stopPropagation()}
          />
        )}
        
        {isEditing ? (
          <div className="task-card-edit-container" onDragStart={(e) => e.stopPropagation()}>
            <input
              type="text"
              className="task-card-edit-title"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              placeholder="Task title"
            />
            
            <div className="task-card-edit-row">
              <select
                className="task-card-edit-priority"
                value={editPriority}
                onChange={(e) => setEditPriority(e.target.value)}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              
              <input
                type="date"
                className="task-card-edit-date"
                value={editDueDate}
                onChange={(e) => setEditDueDate(e.target.value)}
              />
            </div>
          </div>
        ) : (
          <div className="task-card-details">
            <span className="task-card-title">{title}</span>
            <div className="task-card-meta">
              <span className={`priority-badge priority-${priority.toLowerCase()}`}>
                {getPriorityBadge(priority)}
              </span>
              <span className="due-date-display">
                <FaCalendarAlt className="calendar-icon" />
                {isOverdue ? "Overdue: " : "Due: "}{formattedDate}
              </span>
            </div>
          </div>
        )}
      </div>
      
      <div className="task-card-actions">
        {isEditing ? (
          <>
            <button
              className="task-card-action-btn save-btn"
              onClick={handleSave}
              onDragStart={(e) => e.stopPropagation()}
              aria-label="Save changes"
            >
              <FaCheck />
            </button>
            <button
              className="task-card-action-btn cancel-btn"
              onClick={() => setIsEditing(false)}
              onDragStart={(e) => e.stopPropagation()}
              aria-label="Cancel editing"
            >
              <FaTimes />
            </button>
          </>
        ) : (
          <>
            <button
              className="task-card-action-btn edit-btn"
              onClick={handleEditStart}
              onDragStart={(e) => e.stopPropagation()}
              aria-label="Edit task"
            >
              <FaPencilAlt />
            </button>
            <button
              className="task-card-action-btn delete-btn"
              onClick={() => onDelete(task._id)}
              onDragStart={(e) => e.stopPropagation()}
              aria-label="Delete task"
            >
              <FaTrash />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
