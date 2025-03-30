import { useState } from 'react';
import { motion } from 'framer-motion';
import { MoreVertical, Check, Trash } from 'lucide-react';
import { formatDate } from '@/lib/date-utils';
import { BaseItem } from '@/types/shared';
import IconButton from '../buttons/IconButton';

/**
 * Props for the BaseCard component
 */
export interface BaseCardProps extends BaseItem {
  type: 'task' | 'event';
  onEdit: (id: number | string) => void;
  onDelete: (id: number | string) => void;
  onToggleComplete?: (id: number | string) => Promise<void>;
  className?: string;
}

/**
 * Base card component used for displaying tasks and events
 * Provides consistent styling and behavior across the application
 */
export default function BaseCard({
  id,
  title,
  date,
  notes,
  type,
  priority,
  completed = false,
  onEdit,
  onDelete,
  onToggleComplete,
  className = '',
}: BaseCardProps) {
  const [isAnimatingComplete, setIsAnimatingComplete] = useState(false);
  
  const bgColor = type === 'task' 
    ? completed 
      ? 'bg-gray-50/80' 
      : 'bg-white' 
    : 'bg-blue-50/80';
  
  const textColor = type === 'task'
    ? completed
      ? 'text-gray-400'
      : 'text-gray-800'
    : 'text-blue-700';
  
  const borderColor = type === 'task'
    ? completed
      ? 'border-gray-100'
      : 'border-gray-200'
    : 'border-blue-200';

  const getPriorityColor = (priority?: 'low' | 'medium' | 'high') => {
    if (completed) return 'text-gray-400';
    switch (priority) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  const getPriorityBg = (priority?: 'low' | 'medium' | 'high') => {
    if (completed) return 'bg-gray-100';
    switch (priority) {
      case 'high':
        return 'bg-red-50';
      case 'medium':
        return 'bg-yellow-50';
      case 'low':
        return 'bg-green-50';
      default:
        return 'bg-gray-50';
    }
  };

  const handleToggleComplete = async () => {
    if (!onToggleComplete) return;
    
    setIsAnimatingComplete(true);
    try {
      await onToggleComplete(id);
    } catch (error) {
      setIsAnimatingComplete(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ 
        opacity: completed ? 0.8 : 1,
        y: 0,
        scale: completed ? 0.98 : 1
      }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ 
        duration: 0.2,
        ease: "easeInOut"
      }}
      className={`group relative flex items-start gap-3 p-3 rounded-lg ${bgColor} ${borderColor} border hover:shadow-lg transition-all ${className}`}
    >
      {type === 'task' && onToggleComplete && (
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleToggleComplete}
          className="flex-none mt-0.5 focus:outline-none"
          disabled={isAnimatingComplete}
        >
          <div 
            className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ${
              completed 
                ? 'bg-blue-500 border-blue-500' 
                : 'border-gray-300 hover:border-blue-400'
            } flex items-center justify-center`}
          >
            <motion.div
              initial={false}
              animate={{ 
                opacity: completed ? 1 : 0,
                scale: completed ? 1 : 0.5
              }}
              transition={{ duration: 0.2 }}
            >
              {completed && <Check size={14} className="text-white" />}
            </motion.div>
          </div>
        </motion.button>
      )}
      
      <div 
        className="flex-1 min-w-0 cursor-pointer" 
        onClick={() => onEdit(id)}
      >
        <div className="flex items-center gap-2">
          <div className={`text-sm font-semibold ${textColor} break-words ${
            completed ? 'line-through' : ''
          }`}>
            {title}
          </div>
          {type === 'task' && priority && (
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityBg(priority)} ${getPriorityColor(priority)} capitalize`}>
              {priority}
            </span>
          )}
        </div>
        {notes && (
          <div className={`text-sm mt-1 break-words ${
            completed ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {notes}
          </div>
        )}
        <div className="text-xs text-gray-500 mt-2 flex items-center gap-2">
          <span className="flex items-center gap-1">
            <span className="font-medium">{type === 'task' ? 'Due:' : 'When:'}</span>
            {formatDate(date, { format: 'short', includeTime: true })}
          </span>
        </div>
      </div>

      <div className="flex-none flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
        <IconButton
          icon={MoreVertical}
          onClick={() => onEdit(id)}
          title="Edit"
        />
        <IconButton
          icon={Trash}
          onClick={() => onDelete(id)}
          title="Delete"
          variant="danger"
        />
      </div>
    </motion.div>
  );
} 