import { CalendarItem } from '../types';
import BaseCard from '@/components/shared/cards/BaseCard';
import { useLoadingState } from '@/lib/hooks/use-loading-state';

/**
 * Props for the EventCard component
 */
interface EventCardProps {
  item: CalendarItem;
  onEdit: (id: number | string) => void;
  onDelete: (id: number | string) => void;
  onToggleTask?: (id: number | string) => Promise<void>;
}

/**
 * EventCard component for displaying calendar events
 * Extends BaseCard with event-specific functionality
 */
export default function EventCard({ item, onEdit, onDelete, onToggleTask }: EventCardProps) {
  const { state, withLoading } = useLoadingState();

  const handleDelete = async (id: number | string) => {
    await withLoading(async () => {
      await onDelete(id);
    });
  };

  return (
    <BaseCard
      id={item.id}
      title={item.title}
      date={item.date}
      notes={item.notes}
      type={item.type}
      priority={item.priority}
      completed={item.completed}
      onEdit={() => onEdit(item.id)}
      onDelete={handleDelete}
      onToggleComplete={item.type === 'task' ? onToggleTask : undefined}
    />
  );
} 