'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { TaskList as TaskListType } from '@/types/task';
import TaskList from './TaskList';

interface TaskBoardProps {
  taskLists: TaskListType[];
  onTaskReorder: (listId: string, startIndex: number, endIndex: number) => void;
  onTaskMove: (taskId: string, sourceListId: string, destinationListId: string, destinationIndex: number) => void;
  onTaskDelete: (listId: string, taskId: string) => void;
  onTaskUpdate: (listId: string, taskId: string, content: string) => void;
  onListDelete: (listId: string) => void;
  onListUpdate: (listId: string, title: string) => void;
  onTaskAdd: (listId: string, content: string) => void;
}

export default function TaskBoard({
  taskLists,
  onTaskReorder,
  onTaskMove,
  onTaskDelete,
  onTaskUpdate,
  onListDelete,
  onListUpdate,
  onTaskAdd,
}: TaskBoardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex gap-6 overflow-x-auto pb-6"
    >
      <AnimatePresence>
        {taskLists.map((list, index) => (
          <motion.div
            key={list.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex-none w-80"
          >
            <TaskList
              list={list}
              index={index}
              onTaskReorder={onTaskReorder}
              onTaskMove={onTaskMove}
              onTaskDelete={onTaskDelete}
              onTaskUpdate={onTaskUpdate}
              onListDelete={onListDelete}
              onListUpdate={onListUpdate}
              onTaskAdd={onTaskAdd}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
} 