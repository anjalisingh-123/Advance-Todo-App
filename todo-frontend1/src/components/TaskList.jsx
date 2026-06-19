import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaClipboardList, FaSearch } from 'react-icons/fa';
import TaskCard from './TaskCard';

const TaskList = ({ tasks, onDelete, onToggle, onUpdate, onReorder, hasActiveTasks }) => {
  const [draggedIndex, setDraggedIndex] = useState(null);

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const reordered = [...tasks];
    const item = reordered[draggedIndex];
    reordered.splice(draggedIndex, 1);
    reordered.splice(index, 0, item);

    setDraggedIndex(index);
    onReorder(reordered);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const focusTitleInput = () => {
    const titleInput = document.querySelector('.taskForm-title');
    if (titleInput) {
      titleInput.focus();
    }
  };

  if (!hasActiveTasks) {
    return (
      <motion.div
        className="empty-state"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="empty-state-icon">
          <FaClipboardList />
        </div>
        <h3 className="empty-state-title">No tasks yet!</h3>
        <p className="empty-state-description">Add a task below to get started and organize your day.</p>
        <button className="empty-state-cta-btn" onClick={focusTitleInput}>
          Create your first task
        </button>
      </motion.div>
    );
  }

  if (tasks.length === 0) {
    return (
      <motion.div
        className="empty-state"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="empty-state-icon search-empty">
          <FaSearch />
        </div>
        <h3 className="empty-state-title">No matching tasks</h3>
        <p className="empty-state-description">Try adjusting your keywords or check your spelling.</p>
      </motion.div>
    );
  }

  return (
    <div className="task-list">
      <AnimatePresence initial={false}>
        {tasks.map((task, index) => (
          <motion.div
            key={task._id}
            layout
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -10, transition: { duration: 0.18 } }}
            transition={{ type: "spring", stiffness: 500, damping: 32 }}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={`task-card-drag-wrapper ${draggedIndex === index ? 'dragging' : ''}`}
          >
            <TaskCard
              task={task}
              onToggle={onToggle}
              onDelete={onDelete}
              onUpdate={onUpdate}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TaskList;
