'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ChevronDown, ChevronRight, Trash2 } from 'lucide-react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { Task } from '@/types/task';
import TaskCard from './TaskCard';
import { inputStyles, buttonStyles } from '../utils/styles';

interface TaskListProps {
  id: string;
  title: string;
  tasks: Task[];
  accentColor: string;
  bgTint: string;
  onAddTask: (listId: string, title: string, dueDate: Date, priority: 'LOW' | 'MEDIUM' | 'HIGH') => void;
  onUpdateTask: (listId: string, taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (listId: string, taskId: string) => void;
  onDeleteList: (listId: string) => void;
  onReorderTasks: (listId: string, startIndex: number, endIndex: number) => void;
  onMoveTask: (
    taskId: string,
    sourceListId: string,
    destinationListId: string,
    destinationIndex: number
  ) => void;
  onUpdateList: (listId: string, title: string) => void;
}

const TaskList = ({ 
  id, 
  title, 
  tasks, 
  accentColor, 
  bgTint, 
  onAddTask, 
  onUpdateTask, 
  onDeleteTask, 
  onDeleteList,
  onReorderTasks,
  onMoveTask,
  onUpdateList
}: TaskListProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
  const [newTaskDueDate, setNewTaskDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [isHovered, setIsHovered] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      onAddTask(id, newTaskTitle, new Date(newTaskDueDate), newTaskPriority);
      setNewTaskTitle('');
      setNewTaskPriority('MEDIUM');
      setNewTaskDueDate(new Date().toISOString().split('T')[0]);
      setIsAdding(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-lg shadow-sm mb-6 relative ${bgTint} group`}
      style={{ borderLeft: `4px solid ${accentColor}` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div 
        className="p-4 flex items-center justify-between cursor-pointer relative"
        onClick={() => !isEditingTitle && setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-2">
          {isCollapsed ? (
            <ChevronRight size={20} className="text-gray-400" />
          ) : (
            <ChevronDown size={20} className="text-gray-400" />
          )}
          {isEditingTitle ? (
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (editedTitle.trim() && editedTitle !== title) {
                  onUpdateList(id, editedTitle.trim());
                }
                setIsEditingTitle(false);
              }} 
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="text-lg font-semibold text-gray-800 bg-transparent border-b-2 border-blue-500 focus:outline-none px-1"
                autoFocus
                onBlur={() => {
                  if (editedTitle.trim() && editedTitle !== title) {
                    onUpdateList(id, editedTitle.trim());
                  }
                  setIsEditingTitle(false);
                }}
                onClick={(e) => e.stopPropagation()}
              />
            </form>
          ) : (
            <h2 
              className="text-lg font-semibold text-gray-800 hover:text-blue-600 cursor-pointer" 
              onClick={(e) => {
                e.stopPropagation();
                setIsEditingTitle(true);
                setEditedTitle(title);
              }}
            >
              {title}
            </h2>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsAdding(true);
            }}
            className={buttonStyles.icon}
          >
            <Plus size={20} className="text-gray-500" />
          </button>
          <AnimatePresence>
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: isHovered ? 1 : 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm('Are you sure you want to delete this list and all its tasks?')) {
                  onDeleteList(id);
                }
              }}
              className={buttonStyles.delete}
            >
              <Trash2 size={20} className="text-red-500" />
            </motion.button>
          </AnimatePresence>
        </div>
      </div>

      {/* Quick Add Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="px-4 pb-4 space-y-2"
          >
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Add a new task..."
              className={inputStyles}
              autoFocus
            />
            <div className="flex gap-2">
              <input
                type="date"
                value={newTaskDueDate}
                onChange={(e) => setNewTaskDueDate(e.target.value)}
                className={inputStyles}
              />
              <select
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value as 'LOW' | 'MEDIUM' | 'HIGH')}
                className={inputStyles}
              >
                <option value="LOW">Low Priority</option>
                <option value="MEDIUM">Medium Priority</option>
                <option value="HIGH">High Priority</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="submit"
                className={buttonStyles.primary}
              >
                Add Task
              </button>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className={buttonStyles.secondary}
              >
                Cancel
              </button>
            </div>
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
            <Droppable droppableId={id}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2"
                >
                  {tasks.length === 0 ? (
                    <p className="text-gray-500 text-sm py-2">No tasks in this section</p>
                  ) : (
                    tasks.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`${snapshot.isDragging ? 'shadow-lg' : ''}`}
                          >
                            <TaskCard
                              task={task}
                              onUpdate={(taskId, updates) => onUpdateTask(id, taskId, updates)}
                              onDelete={(taskId) => onDeleteTask(id, taskId)}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TaskList; 