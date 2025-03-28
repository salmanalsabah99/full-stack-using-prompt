'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Flag, Trash2, Edit2 } from 'lucide-react';
import { Task } from '@/types/task';
import { inputStyles, buttonStyles, priorityColors } from '../utils/styles';

interface TaskCardProps {
  task: Task;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
  onDelete: (taskId: string) => void;
}

const TaskCard = ({ task, onUpdate, onDelete }: TaskCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);

  return (
    <div
      className="group relative bg-white rounded-lg p-3 mb-2 border border-gray-100 hover:border-gray-200 transition-colors"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1">
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={editedTask.title}
                onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                className={inputStyles}
                autoFocus
              />
              <textarea
                value={editedTask.description || ''}
                onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                className={inputStyles}
                placeholder="Add description..."
              />
              <div className="flex gap-2">
                <input
                  type="date"
                  value={new Date(editedTask.dueDate).toISOString().split('T')[0]}
                  onChange={(e) => setEditedTask({ ...editedTask, dueDate: new Date(e.target.value) })}
                  className={inputStyles}
                />
                <select
                  value={editedTask.priority}
                  onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value as 'LOW' | 'MEDIUM' | 'HIGH' })}
                  className={inputStyles}
                >
                  <option value="LOW">Low Priority</option>
                  <option value="MEDIUM">Medium Priority</option>
                  <option value="HIGH">High Priority</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onUpdate(task.id, editedTask);
                    setIsEditing(false);
                  }}
                  className={buttonStyles.primary}
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditedTask(task);
                    setIsEditing(false);
                  }}
                  className={buttonStyles.secondary}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
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
                  <Flag size={12} className={priorityColors[task.priority]} />
                  <span>{task.priority}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Hover Actions */}
        <AnimatePresence>
          {isHovered && !isEditing && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex items-center gap-1"
            >
              <button 
                className={buttonStyles.icon}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
              >
                <Edit2 size={16} className="text-gray-500" />
              </button>
              <button 
                className={buttonStyles.delete}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(task.id);
                }}
              >
                <Trash2 size={16} className="text-red-500" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TaskCard; 