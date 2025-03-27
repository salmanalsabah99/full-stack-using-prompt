'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ChevronDown, ChevronRight, Calendar, Flag } from 'lucide-react';
import { Task } from '@/types/task';

interface TaskListProps {
  title: string;
  tasks: Task[];
  accentColor: string;
  bgTint: string;
  onAddTask: (title: string, dueDate: Date) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
}

export default function TaskList({ title, tasks, accentColor, bgTint, onAddTask, onUpdateTask, onDeleteTask }: TaskListProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      const today = new Date();
      let dueDate = new Date();

      if (title === 'Tomorrow') {
        dueDate.setDate(today.getDate() + 1);
      } else if (title === 'Upcoming') {
        dueDate.setDate(today.getDate() + 2);
      }

      onAddTask(newTaskTitle, dueDate);
      setNewTaskTitle('');
      setIsAdding(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-lg shadow-sm mb-6 relative ${bgTint}`}
      style={{ borderLeft: `4px solid ${accentColor}` }}
    >
      {/* Header */}
      <div 
        className="p-4 flex items-center justify-between cursor-pointer"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-2">
          {isCollapsed ? (
            <ChevronRight size={20} className="text-gray-400" />
          ) : (
            <ChevronDown size={20} className="text-gray-400" />
          )}
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsAdding(true);
          }}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <Plus size={20} className="text-gray-500" />
        </button>
      </div>

      {/* Quick Add Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="px-4 pb-4"
          >
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Add a new task..."
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </motion.form>
        )}
      </AnimatePresence>

      {/* Task List */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 pb-4"
          >
            {tasks.length === 0 ? (
              <p className="text-gray-500 text-sm py-2">No tasks in this section</p>
            ) : (
              tasks.map((task) => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  onUpdate={onUpdateTask}
                  onDelete={onDeleteTask}
                />
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface TaskCardProps {
  task: Task;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
  onDelete: (taskId: string) => void;
}

const TaskCard = ({ task, onUpdate, onDelete }: TaskCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="group relative bg-white rounded-lg p-3 mb-2 border border-gray-100 hover:border-gray-200 transition-colors"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-800">{task.title}</h3>
          {task.description && (
            <p className="text-sm text-gray-500 mt-1">{task.description}</p>
          )}
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Calendar size={12} />
              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Flag size={12} className={`text-${task.priority.toLowerCase()}-500`} />
              <span>{task.priority}</span>
            </div>
          </div>
        </div>

        {/* Hover Actions */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex items-center gap-1"
            >
              <button 
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdate(task.id, { completed: !task.completed });
                }}
              >
                {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
              </button>
              <button 
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdate(task.id, { priority: task.priority === 'HIGH' ? 'MEDIUM' : 'HIGH' });
                }}
              >
                {task.priority === 'HIGH' ? 'Mark as Medium Priority' : 'Mark as High Priority'}
              </button>
              <button 
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(task.id);
                }}
              >
                Delete
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}; 