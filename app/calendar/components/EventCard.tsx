import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { format } from 'date-fns';
import { CalendarItem } from '../types';

interface EventCardProps {
  item: CalendarItem;
  onEdit: (item: CalendarItem) => void;
  onDelete: (id: number) => void;
  onToggleTask?: (id: number) => void;
}

export default function EventCard({ item, onEdit, onDelete, onToggleTask }: EventCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getPriorityColor = (priority?: 'low' | 'medium' | 'high') => {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group"
    >
      <div className={`p-2 rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow ${
        item.type === 'task' && item.completed ? 'opacity-60' : ''
      }`}>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              {item.type === 'task' && onToggleTask && (
                <button
                  onClick={() => onToggleTask(item.id)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  {item.completed ? (
                    <CheckCircle2 size={16} className="text-green-500" />
                  ) : (
                    <Circle size={16} className="text-gray-400" />
                  )}
                </button>
              )}
              <div className="flex-1">
                <div className={`text-sm font-medium text-gray-900 truncate ${
                  item.type === 'task' && item.completed ? 'line-through' : ''
                }`}>
                  {item.title}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="text-xs text-gray-500">
                    {format(new Date(item.date), 'h:mm a')}
                  </div>
                  {item.type === 'task' && item.priority && (
                    <div className={`text-xs ${getPriorityColor(item.priority)}`}>
                      {item.priority}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-1"
              >
                <button
                  onClick={() => onEdit(item)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Edit2 size={14} className="text-gray-500" />
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Trash2 size={14} className="text-gray-500" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
} 