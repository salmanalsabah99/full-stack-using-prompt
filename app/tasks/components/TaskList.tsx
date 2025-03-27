'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TaskList as TaskListType, Task } from '@/types/task';
import TaskCard from './TaskCard';
import AddTask from './AddTask';

interface TaskListProps {
  list: TaskListType;
  index: number;
  onTaskReorder: (listId: string, startIndex: number, endIndex: number) => void;
  onTaskMove: (taskId: string, sourceListId: string, destinationListId: string, destinationIndex: number) => void;
  onTaskDelete: (listId: string, taskId: string) => void;
  onTaskUpdate: (listId: string, taskId: string, content: string) => void;
  onListDelete: (listId: string) => void;
  onListUpdate: (listId: string, title: string) => void;
  onTaskAdd: (listId: string, content: string) => void;
}

export default function TaskList({
  list,
  index,
  onTaskReorder,
  onTaskMove,
  onTaskDelete,
  onTaskUpdate,
  onListDelete,
  onListUpdate,
  onTaskAdd,
}: TaskListProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(list.title);

  const handleTitleSubmit = () => {
    if (title.trim()) {
      onListUpdate(String(list.id), title.trim());
      setIsEditing(false);
    }
  };

  return (
    <motion.div
      layout
      className="flex flex-col h-full bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-4"
    >
      <div className="flex items-center justify-between mb-4">
        {isEditing ? (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleSubmit}
            onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
            className="w-full bg-transparent border-none text-white text-lg font-semibold focus:ring-2 focus:ring-sky-300/50 rounded px-2 py-1"
            autoFocus
          />
        ) : (
          <h3
            onClick={() => setIsEditing(true)}
            className="text-white text-lg font-semibold cursor-pointer hover:text-sky-300 transition"
          >
            {list.title}
          </h3>
        )}
        <button
          onClick={() => onListDelete(String(list.id))}
          className="text-white/50 hover:text-white/80 transition"
        >
          ×
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {list.tasks.map((task, taskIndex) => (
          <TaskCard
            key={task.id}
            task={task}
            index={taskIndex}
            onDelete={() => onTaskDelete(String(list.id), String(task.id))}
            onUpdate={(content) => onTaskUpdate(String(list.id), String(task.id), content)}
          />
        ))}
      </div>

      <div className="mt-4">
        <AddTask onAdd={(content) => onTaskAdd(String(list.id), content)} />
      </div>
    </motion.div>
  );
} 