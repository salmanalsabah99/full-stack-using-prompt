'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  ChevronDown,
  ChevronRight,
  Edit2,
  Trash2,
  MoveRight,
  Flag,
  Calendar,
} from 'lucide-react';
import { Task } from '@/types/task';
import AddList from './AddList';

interface TaskListProps {
  id: string;
  title: string;
  tasks: Task[];
  accentColor: string;
  bgTint: string;
  onAddTask: (title: string, dueDate: Date) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
  onDeleteList: (listId: string) => void;
}

const TaskList = ({ id, title, tasks, accentColor, bgTint, onAddTask, onUpdateTask, onDeleteTask, onDeleteList }: TaskListProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isHovered, setIsHovered] = useState(false);

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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsAdding(true);
            }}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Plus size={20} className="text-gray-500" />
          </button>
          {isHovered && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteList(id);
              }}
              className="p-1 hover:bg-red-50 rounded-full transition-colors"
            >
              <Trash2 size={20} className="text-red-500" />
            </button>
          )}
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
};

const TaskCard = ({ task, onUpdate, onDelete }: { task: Task; onUpdate: (taskId: string, updates: Partial<Task>) => void; onDelete: (taskId: string) => void }) => {
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

export default function TaskBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [defaultListId, setDefaultListId] = useState<string | null>(null);
  const [lists, setLists] = useState<any[]>([]);
  const [showAddList, setShowAddList] = useState(false);

  const fetchLists = async () => {
    try {
      const listResponse = await fetch('/api/task-lists');
      if (!listResponse.ok) {
        throw new Error('Failed to fetch task list');
      }
      const data = await listResponse.json();
      setLists(data);
      return data;
    } catch (error) {
      console.error('Error fetching lists:', error);
      throw error;
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      try {
        // First, get or create the default task list
        let lists = await fetchLists();
        
        let defaultList = lists[0];
        if (!defaultList) {
          // Create a default list if none exists
          const createResponse = await fetch('/api/task-lists', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              title: 'My Tasks',
            }),
          });
          
          if (!createResponse.ok) {
            throw new Error('Failed to create default task list');
          }
          
          defaultList = await createResponse.json();
          lists = [defaultList];
        }

        setDefaultListId(defaultList.id);
        setLists(lists);

        // Then fetch tasks for this list
        const taskResponse = await fetch(`/api/tasks?listId=${defaultList.id}`);
        if (!taskResponse.ok) {
          throw new Error('Failed to fetch tasks');
        }
        const data = await taskResponse.json();
        setTasks(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch tasks');
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

  const handleCreateList = async (title: string) => {
    try {
      const response = await fetch('/api/task-lists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create list');
      }
      
      const newList = await response.json();
      setLists([...lists, newList]);
      setDefaultListId(newList.id);
      setShowAddList(false);
      
      // Fetch tasks for the new list
      const taskResponse = await fetch(`/api/tasks?listId=${newList.id}`);
      if (!taskResponse.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const tasks = await taskResponse.json();
      setTasks(tasks);
    } catch (error) {
      console.error('Error creating list:', error);
      setError(error instanceof Error ? error.message : 'Failed to create list');
    }
  };

  const handleAddTask = async (title: string, dueDate: Date) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          dueDate,
          listId: defaultListId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add task');
      }

      const newTask = await response.json();
      setTasks([...tasks, newTask]);
    } catch (error) {
      console.error('Error adding task:', error);
      setError(error instanceof Error ? error.message : 'Failed to add task');
    }
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      const updatedTask = await response.json();
      setTasks(tasks.map(task => 
        task.id === taskId ? updatedTask : task
      ));
    } catch (error) {
      console.error('Error updating task:', error);
      setError(error instanceof Error ? error.message : 'Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete task');
    }
  };

  const handleDeleteList = async (listId: string) => {
    try {
      const response = await fetch(`/api/task-lists?id=${listId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete list');
      }

      // Update lists state
      setLists(lists.filter(list => list.id !== listId));
      
      // If the deleted list was the default list, set a new default
      if (listId === defaultListId && lists.length > 0) {
        const newDefaultList = lists.find(list => list.id !== listId);
        if (newDefaultList) {
          setDefaultListId(newDefaultList.id);
          // Fetch tasks for the new default list
          const taskResponse = await fetch(`/api/tasks?listId=${newDefaultList.id}`);
          if (!taskResponse.ok) {
            throw new Error('Failed to fetch tasks');
          }
          const tasks = await taskResponse.json();
          setTasks(tasks);
        }
      }
    } catch (error) {
      console.error('Error deleting list:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete list');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
        <button
          onClick={() => setShowAddList(true)}
          className="px-4 py-2 bg-white text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <Plus size={16} />
          Create List
        </button>
      </div>

      <AnimatePresence>
        {showAddList && (
          <AddList
            onListAdd={handleCreateList}
            onCancel={() => setShowAddList(false)}
          />
        )}
      </AnimatePresence>

      <div className="space-y-6">
        {lists.map((list) => (
          <TaskList
            key={list.id}
            id={list.id}
            title={list.title}
            tasks={tasks.filter(task => task.listId === list.id)}
            accentColor="#3B82F6"
            bgTint="bg-white"
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            onDeleteList={handleDeleteList}
          />
        ))}
      </div>
    </div>
  );
} 