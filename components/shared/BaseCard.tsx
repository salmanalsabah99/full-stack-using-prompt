import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreVertical, Check, Trash } from 'lucide-react';
import { formatDate } from '@/lib/date-utils';
import { BaseItem, DateFormatOptions } from '@/types/shared';

export interface BaseCardProps extends BaseItem {
  type: 'task' | 'event';
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onToggleComplete?: (id: number) => Promise<void>;
  className?: string;
}

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
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimatingComplete, setIsAnimatingComplete] = useState(false);
  
  const bgColor = type === 'task' 
    ? completed 
      ? 'bg-gray-50/80' 
      : 'bg-gray-50' 
    : 'bg-blue-50';
  
  const textColor = type === 'task'
    ? completed
      ? 'text-gray-400'
      : 'text-gray-700'
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
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`group relative flex items-start gap-2 p-2 rounded-md ${bgColor} ${borderColor} hover:shadow-sm transition-all ${className}`}
    >
      {type === 'task' && onToggleComplete && (
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleToggleComplete}
          className="flex-none mt-0.5 focus:outline-none"
          disabled={isAnimatingComplete}
        >
          <div 
            className={`w-4 h-4 rounded border transition-all duration-200 ${
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
              {completed && <Check size={12} className="text-white" />}
            </motion.div>
          </div>
        </motion.button>
      )}
      
      <div 
        className="flex-1 min-w-0 cursor-pointer" 
        onClick={() => onEdit(id)}
      >
        <div className={`text-sm font-medium ${textColor} break-words ${
          completed ? 'line-through' : ''
        }`}>
          {title}
        </div>
        {notes && (
          <div className={`text-xs mt-0.5 break-words ${
            completed ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {notes}
          </div>
        )}
        <div className="text-xs text-gray-400 mt-1 flex items-center gap-2">
          <span>{formatDate(date, { format: 'short', includeTime: true })}</span>
          {type === 'task' && priority && (
            <span className={`${getPriorityColor(priority)} capitalize`}>
              {priority}
            </span>
          )}
        </div>
      </div>

      <div className="flex-none flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(id)}
          className="p-1 hover:bg-gray-100 rounded-full"
          title="Edit"
        >
          <MoreVertical size={14} className="text-gray-500" />
        </button>
        <button
          onClick={() => onDelete(id)}
          className="p-1 hover:bg-red-100 rounded-full"
          title="Delete"
        >
          <Trash size={14} className="text-gray-500 hover:text-red-500" />
        </button>
      </div>
    </motion.div>
  );
} 