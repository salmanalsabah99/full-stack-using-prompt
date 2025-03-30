'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ChevronDown, ChevronRight, Trash2 } from 'lucide-react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { Task } from '@/types/task';
import { PriorityUppercase } from '@/types/shared';
import { TaskCard } from './TaskCard';
import { inputStyles, buttonStyles } from '../utils/styles';
import { useLoadingState } from '@/lib/hooks/use-loading-state';
import { usePagination } from '@/lib/hooks/use-pagination';
import { useInfiniteScroll } from '@/lib/hooks/use-infinite-scroll';
import { useDebounce } from '@/lib/hooks/use-debounce';
import { useThrottle } from '@/lib/hooks/use-throttle';

interface TaskListProps {
  id: string;
  title: string;
  tasks: Task[];
  accentColor: string;
  bgTint: string;
  onAddTask: (listId: string, title: string, dueDate: Date, priority: PriorityUppercase) => void;
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
  onUpdate: (task: Task) => Promise<void>;
  onDelete: (id: number | string) => Promise<void>;
  onLoadMore?: () => Promise<void>;
  hasMore?: boolean;
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
  onUpdateList,
  onUpdate,
  onDelete,
  onLoadMore,
  hasMore
}: TaskListProps) => {
  const { state, withLoading } = useLoadingState();
  const { page, setPage, limit, total } = usePagination({
    initialPage: 1,
    initialLimit: 10
  });
  const { items, state: scrollState, loadingRef, reset } = useInfiniteScroll<Task>({
    loadMore: async (page) => {
      if (onLoadMore) {
        await onLoadMore();
      }
      return [];
    },
    threshold: 0.5
  });
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
  const [newTaskDueDate, setNewTaskDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [isHovered, setIsHovered] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, { delay: 300 });
  const throttledScroll = useThrottle(() => {
    if (onLoadMore) {
      onLoadMore();
    }
  }, { delay: 500 });

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

  useEffect(() => {
    const handleScroll = () => {
      if (hasMore && scrollState !== 'loading' && onLoadMore) {
        throttledScroll();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, scrollState, throttledScroll, onLoadMore]);

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    task.description?.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const paginatedTasks = filteredTasks.slice(
    (page - 1) * limit,
    page * limit
  );

  const handleUpdate = async (task: Task) => {
    await withLoading(async () => {
      await onUpdate(task);
    });
  };

  const handleDelete = async (id: number | string) => {
    await withLoading(async () => {
      await onDelete(id);
    });
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
            <div className="flex items-center gap-2 mb-4">
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Droppable droppableId={id}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2"
                >
                  {paginatedTasks.length === 0 ? (
                    <p className="text-gray-500 text-sm py-2">No tasks in this section</p>
                  ) : (
                    paginatedTasks.map((task, index) => (
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
                              onUpdate={handleUpdate}
                              onDelete={handleDelete}
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

      <div ref={loadingRef} className="flex justify-center py-4">
        {scrollState === 'loading' && (
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        )}
      </div>

      {state === 'loading' && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      )}
    </motion.div>
  );
};

export default TaskList; 