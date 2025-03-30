'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Flag, Trash2, Edit2, Check } from 'lucide-react';
import { Task } from '@/types/task';
import BaseCard from '@/components/shared/cards/BaseCard';
import { useLoadingState } from '@/lib/hooks/use-loading-state';
import { convertPriorityToLowercase } from '@/types/shared';

/**
 * Props for the TaskCard component
 */
interface TaskCardProps {
  task: Task;
  onUpdate: (task: Task) => void;
  onDelete: (id: number | string) => void;
}

/**
 * TaskCard component for displaying individual tasks
 * Extends BaseCard with task-specific functionality
 */
export function TaskCard({ task, onUpdate, onDelete }: TaskCardProps) {
  const { state, withLoading } = useLoadingState();

  const handleUpdate = async (updatedTask: Task) => {
    try {
      await withLoading(async () => {
        await onUpdate(updatedTask);
      });
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDelete = async (id: number | string) => {
    try {
      await withLoading(async () => {
        await onDelete(id);
      });
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleToggleComplete = async (id: number | string) => {
    try {
      await withLoading(async () => {
        await onUpdate({ ...task, completed: !task.completed });
      });
    } catch (error) {
      console.error('Error toggling task completion:', error);
    }
  };

  return (
    <BaseCard
      id={task.id}
      title={task.title}
      date={task.dueDate}
      notes={task.description}
      type="task"
      priority={task.priority ? convertPriorityToLowercase(task.priority) : undefined}
      completed={task.completed}
      onEdit={() => handleUpdate(task)}
      onDelete={handleDelete}
      onToggleComplete={handleToggleComplete}
    />
  );
} 