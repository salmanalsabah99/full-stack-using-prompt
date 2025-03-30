'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { useTaskLists } from '../hooks/useTaskLists';
import TaskList from './TaskList';
import AddList from './AddList';
import { getListColor } from '@/lib/constants';
import { buttonStyles } from '../utils/styles';
import { Task } from '@/types/task';

const TaskBoard = () => {
  const {
    taskLists,
    isLoading,
    error,
    handleTaskAdd,
    handleTaskUpdate,
    handleTaskDelete,
    handleListAdd,
    handleListDelete,
    handleTaskReorder,
    handleTaskMove,
    handleListUpdate,
  } = useTaskLists();

  const [isAddingList, setIsAddingList] = useState(false);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    if (source.droppableId !== destination.droppableId) {
      handleTaskMove(draggableId, source.droppableId, destination.droppableId, destination.index);
    } else {
      handleTaskReorder(source.droppableId, source.index, destination.index);
    }
  };

  const handleTaskUpdateWrapper = async (task: Task) => {
    await handleTaskUpdate(task.listId, task.id, task);
  };

  const handleTaskDeleteWrapper = async (id: string | number) => {
    const task = taskLists.flatMap(list => list.tasks).find(t => t.id === id);
    if (task) {
      await handleTaskDelete(task.listId, task.id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Task Board</h1>
          <button
            onClick={() => setIsAddingList(true)}
            className={buttonStyles.primary}
          >
            Add List
          </button>
        </div>

        <AnimatePresence>
          {isAddingList && (
            <AddList
              onListAdd={(title) => {
                handleListAdd(title);
                setIsAddingList(false);
              }}
              onCancel={() => setIsAddingList(false)}
            />
          )}
        </AnimatePresence>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="space-y-6">
            {taskLists.map((list, index) => (
              <TaskList
                key={list.id}
                id={list.id}
                title={list.title}
                tasks={list.tasks}
                accentColor={getListColor(index).accent}
                bgTint={getListColor(index).bg}
                onAddTask={handleTaskAdd}
                onUpdateTask={handleTaskUpdate}
                onDeleteTask={handleTaskDelete}
                onDeleteList={handleListDelete}
                onReorderTasks={handleTaskReorder}
                onMoveTask={handleTaskMove}
                onUpdateList={handleListUpdate}
                onUpdate={handleTaskUpdateWrapper}
                onDelete={handleTaskDeleteWrapper}
              />
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};

export default TaskBoard; 